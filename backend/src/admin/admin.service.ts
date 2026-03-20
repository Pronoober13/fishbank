import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { Report } from '../entities/report.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { SellerVerificationStatus, ProductStatus, ReportStatus } from '../common/enums';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    @InjectRepository(AuditLog) private auditLogRepository: Repository<AuditLog>,
  ) {}

  async getDashboard() {
    const [totalUsers, totalSellers, totalProducts, totalOrders] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { sellerVerificationStatus: SellerVerificationStatus.APPROVED } }),
      this.productRepository.count({ where: { status: ProductStatus.APPROVED } }),
      this.orderRepository.count(),
    ]);

    const pendingProducts = await this.productRepository.count({ where: { status: ProductStatus.PENDING_REVIEW } });
    const pendingSellers = await this.userRepository.count({ where: { sellerVerificationStatus: SellerVerificationStatus.PENDING } });
    const pendingReports = await this.reportRepository.count({ where: { status: ReportStatus.PENDING } });

    // Revenue stats
    const revenueResult = await this.orderRepository.createQueryBuilder('o')
      .select('SUM(o.totalPrice)', 'totalGMV')
      .addSelect('SUM(o.platformFee)', 'totalFee')
      .addSelect('COUNT(o.id)', 'completedOrders')
      .where('o.status = :status', { status: 'completed' })
      .getRawOne();

    return {
      totalUsers, totalSellers, totalProducts, totalOrders,
      pendingProducts, pendingSellers, pendingReports,
      totalGMV: revenueResult?.totalGMV || 0,
      totalPlatformFee: revenueResult?.totalFee || 0,
      completedOrders: revenueResult?.completedOrders || 0,
    };
  }

  // Seller verification management
  async getPendingSellers() {
    return this.userRepository.find({
      where: { sellerVerificationStatus: SellerVerificationStatus.PENDING },
      order: { updatedAt: 'ASC' },
    });
  }

  async approveSeller(userId: string, adminId: string) {
    await this.userRepository.update(userId, { sellerVerificationStatus: SellerVerificationStatus.APPROVED });
    await this.logAction(adminId, 'APPROVE_SELLER', 'user', userId);
    return { message: 'Seller berhasil diverifikasi' };
  }

  async rejectSeller(userId: string, adminId: string, reason: string) {
    await this.userRepository.update(userId, { sellerVerificationStatus: SellerVerificationStatus.REJECTED });
    await this.logAction(adminId, 'REJECT_SELLER', 'user', userId, { reason });
    return { message: 'Seller ditolak' };
  }

  // Product moderation
  async getPendingProducts() {
    return this.productRepository.find({
      where: { status: ProductStatus.PENDING_REVIEW },
      relations: ['seller', 'fishSpecies'],
      order: { createdAt: 'ASC' },
    });
  }

  async approveProduct(productId: string, adminId: string) {
    await this.productRepository.update(productId, { status: ProductStatus.APPROVED });
    await this.logAction(adminId, 'APPROVE_PRODUCT', 'product', productId);
    return { message: 'Produk berhasil disetujui' };
  }

  async rejectProduct(productId: string, adminId: string, reason: string) {
    await this.productRepository.update(productId, { status: ProductStatus.REJECTED, rejectionReason: reason });
    await this.logAction(adminId, 'REJECT_PRODUCT', 'product', productId, { reason });
    return { message: 'Produk ditolak' };
  }

  // User management
  async banUser(userId: string, adminId: string, reason: string) {
    await this.userRepository.update(userId, { isBanned: true, banReason: reason });
    await this.logAction(adminId, 'BAN_USER', 'user', userId, { reason });
    return { message: 'User berhasil diblokir' };
  }

  async unbanUser(userId: string, adminId: string) {
    await this.userRepository.update(userId, { isBanned: false, banReason: undefined });
    await this.logAction(adminId, 'UNBAN_USER', 'user', userId);
    return { message: 'User berhasil di-unblock' };
  }

  // Report resolution
  async resolveReport(reportId: string, adminId: string, note: string, status: ReportStatus) {
    await this.reportRepository.update(reportId, { status, adminNote: note, resolvedById: adminId });
    await this.logAction(adminId, 'RESOLVE_REPORT', 'report', reportId, { note, status });
    return { message: 'Laporan berhasil diproses' };
  }

  private async logAction(userId: string, action: string, entity: string, entityId: string, details?: any) {
    await this.auditLogRepository.save(this.auditLogRepository.create({
      userId, action, entity, entityId, details,
    }));
  }
}

