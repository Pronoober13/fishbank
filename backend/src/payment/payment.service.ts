import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { OrderStatus } from '../common/enums';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const midtransClient = require('midtrans-client');

@Injectable()
export class PaymentService {
  private snap: any;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AuditLog) private auditLogRepository: Repository<AuditLog>,
  ) {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: this.configService.get('MIDTRANS_SERVER_KEY', 'SB-Mid-server-PLACEHOLDER'),
      clientKey: this.configService.get('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-PLACEHOLDER'),
    });
  }

  async createTransaction(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['product', 'buyer'],
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan');
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order sudah diproses atau dibayar');
    }

    const parameter = {
      transaction_details: {
        order_id: order.orderNumber,
        gross_amount: Math.round(Number(order.totalPrice)),
      },
      item_details: [
        {
          id: order.productId,
          price: Math.round(Number(order.unitPrice)),
          quantity: order.quantity,
          name: order.product?.title?.substring(0, 50) || 'Produk FishBank',
        },
        ...(Number(order.platformFee) > 0
          ? [{
              id: 'platform-fee',
              price: Math.round(Number(order.platformFee)),
              quantity: 1,
              name: 'Biaya Platform',
            }]
          : []),
      ],
      customer_details: {
        first_name: order.buyer?.fullName || 'Buyer',
        email: order.buyer?.email || '',
        phone: order.buyer?.phone || '',
      },
      callbacks: {
        finish: `${this.configService.get('FRONTEND_URL', 'http://localhost:3001')}/dashboard?tab=orders`,
      },
    };

    try {
      const transaction = await this.snap.createTransaction(parameter);
      // Store payment ID
      await this.orderRepository.update(orderId, { paymentId: transaction.token });
      return {
        snapToken: transaction.token,
        redirectUrl: transaction.redirect_url,
      };
    } catch (error: any) {
      throw new BadRequestException(`Gagal membuat transaksi pembayaran: ${error.message}`);
    }
  }

  async handleNotification(notification: any) {
    const statusResponse = await this.snap.transaction.notification(notification);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    const order = await this.orderRepository.findOne({
      where: { orderNumber: orderId },
    });
    if (!order) return;

    let newStatus: OrderStatus | null = null;

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        newStatus = OrderStatus.PAID;
      }
    } else if (transactionStatus === 'pending') {
      // Still pending, no change
    } else if (['deny', 'cancel', 'expire'].includes(transactionStatus)) {
      newStatus = OrderStatus.CANCELLED;
      // Restore stock
      await this.productRepository.increment({ id: order.productId }, 'stock', order.quantity);
    }

    if (newStatus) {
      await this.orderRepository.update(order.id, {
        status: newStatus,
        ...(newStatus === OrderStatus.PAID ? { paidAt: new Date() } : {}),
      });

      // Audit log
      await this.auditLogRepository.save(this.auditLogRepository.create({
        action: 'PAYMENT_NOTIFICATION',
        entity: 'order',
        entityId: order.id,
        details: { orderNumber: orderId, transactionStatus, fraudStatus, newStatus },
      }));
    }
  }

  getClientKey(): string {
    return this.configService.get('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-PLACEHOLDER');
  }
}
