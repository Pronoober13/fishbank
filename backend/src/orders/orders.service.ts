import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus, ProductStatus } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(buyerId: string, dto: CreateOrderDto) {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId, status: ProductStatus.APPROVED },
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan atau belum disetujui');
    if (product.stock < dto.quantity) throw new BadRequestException('Stok tidak mencukupi');
    if (product.sellerId === buyerId) throw new BadRequestException('Tidak dapat membeli produk sendiri');

    const totalPrice = Number(product.price) * dto.quantity;
    // Calculate platform fee (BR-004)
    const seller = await this.userRepository.findOne({ where: { id: product.sellerId } });
    let feePercent = 0.05; // 5% default
    if (seller && seller.averageRating >= 4.8) feePercent = 0.03; // 3% premium
    const platformFee = totalPrice * feePercent;

    const orderNumber = `FB-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`;

    const order = this.orderRepository.create({
      orderNumber, buyerId, sellerId: product.sellerId, productId: dto.productId,
      quantity: dto.quantity, unitPrice: product.price, totalPrice, platformFee,
      shippingMethod: dto.shippingMethod, shippingAddress: dto.shippingAddress,
      notes: dto.notes, status: OrderStatus.PENDING,
    });

    // Reduce stock
    await this.productRepository.decrement({ id: dto.productId }, 'stock', dto.quantity);
    return this.orderRepository.save(order);
  }

  async findBuyerOrders(buyerId: string) {
    return this.orderRepository.find({
      where: { buyerId },
      relations: ['product', 'product.fishSpecies', 'seller'],
      order: { createdAt: 'DESC' },
    });
  }

  async findSellerOrders(sellerId: string) {
    return this.orderRepository.find({
      where: { sellerId },
      relations: ['product', 'product.fishSpecies', 'buyer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['product', 'product.fishSpecies', 'buyer', 'seller'],
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan');
    return order;
  }

  async updateStatus(id: string, userId: string, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    if (order.buyerId !== userId && order.sellerId !== userId) {
      throw new BadRequestException('Anda tidak memiliki akses ke order ini');
    }

    const updateData: Partial<Order> = { status: dto.status };
    if (dto.trackingNumber) updateData.trackingNumber = dto.trackingNumber;
    if (dto.cancelReason) updateData.cancelReason = dto.cancelReason;

    if (dto.status === OrderStatus.SHIPPED) updateData.shippedAt = new Date();
    if (dto.status === OrderStatus.DELIVERED) updateData.deliveredAt = new Date();
    if (dto.status === OrderStatus.COMPLETED) {
      updateData.completedAt = new Date();
      // Update seller transaction count
      await this.userRepository.increment({ id: order.sellerId }, 'totalTransactions', 1);
    }
    if (dto.status === OrderStatus.CANCELLED) {
      // Restore stock
      await this.productRepository.increment({ id: order.productId }, 'stock', order.quantity);
    }

    await this.orderRepository.update(id, updateData);
    return this.findOne(id);
  }
}

