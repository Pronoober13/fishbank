import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateReviewDto } from './dto/review.dto';
import { OrderStatus } from '../common/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    // Verify order belongs to reviewer and is completed
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId, buyerId: reviewerId },
    });
    if (!order) throw new NotFoundException('Order tidak ditemukan');
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('Review hanya dapat diberikan setelah order selesai');
    }

    // Check if already reviewed
    const existing = await this.reviewRepository.findOne({
      where: { orderId: dto.orderId, reviewerId },
    });
    if (existing) throw new BadRequestException('Anda sudah memberikan review untuk order ini');

    const review = this.reviewRepository.create({ ...dto, reviewerId });
    const saved = await this.reviewRepository.save(review);

    // Update product average rating
    const { avg, count } = await this.reviewRepository.createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.productId = :pid', { pid: dto.productId })
      .getRawOne();

    await this.productRepository.update(dto.productId, {
      averageRating: parseFloat(avg) || 0,
      totalReviews: parseInt(count) || 0,
    });

    // Update seller average rating
    const product = await this.productRepository.findOne({ where: { id: dto.productId } });
    if (product) {
      const sellerAvg = await this.reviewRepository.createQueryBuilder('r')
        .innerJoin('r.product', 'p')
        .select('AVG(r.rating)', 'avg')
        .addSelect('COUNT(r.id)', 'count')
        .where('p.sellerId = :sid', { sid: product.sellerId })
        .getRawOne();

      await this.userRepository.update(product.sellerId, {
        averageRating: parseFloat(sellerAvg.avg) || 0,
        totalReviews: parseInt(sellerAvg.count) || 0,
      });
    }

    return saved;
  }

  async getProductReviews(productId: string) {
    return this.reviewRepository.find({
      where: { productId },
      relations: ['reviewer'],
      order: { createdAt: 'DESC' },
    });
  }
}

