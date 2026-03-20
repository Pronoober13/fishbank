import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { FishService } from '../fish/fish.service';
import { CreateProductDto, UpdateProductDto, SearchProductDto } from './dto/product.dto';
import { ProductStatus, SellerVerificationStatus } from '../common/enums';
import { User } from '../entities/user.entity';
import { RedisCacheService } from '../cache/redis-cache.service';

const PRODUCT_DETAIL_TTL = 1800;  // 30 min
const PRODUCT_LIST_TTL = 600;     // 10 min

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AuditLog) private auditLogRepository: Repository<AuditLog>,
    private fishService: FishService,
    private cache: RedisCacheService,
  ) {}

  async create(sellerId: string, dto: CreateProductDto) {
    // Verify seller is approved
    const seller = await this.userRepository.findOne({ where: { id: sellerId } });
    if (!seller || seller.sellerVerificationStatus !== SellerVerificationStatus.APPROVED) {
      throw new ForbiddenException('Anda harus terverifikasi sebagai seller');
    }

    // Check protected species (BR-001, FR-012)
    const isProtected = await this.fishService.isProtectedSpecies(dto.fishSpeciesId);
    if (isProtected) {
      // Log the attempt
      await this.auditLogRepository.save(this.auditLogRepository.create({
        userId: sellerId, action: 'ATTEMPT_LIST_PROTECTED_SPECIES',
        entity: 'product', entityId: dto.fishSpeciesId,
        details: { fishSpeciesId: dto.fishSpeciesId, title: dto.title },
      }));
      throw new BadRequestException(
        'Ikan ini dilindungi oleh UU No. 31/2004 tentang Perikanan. Perdagangan memerlukan izin khusus.',
      );
    }

    // Validate images (min 3)
    if (!dto.imageUrls || dto.imageUrls.length < 3) {
      throw new BadRequestException('Minimal 3 foto produk diperlukan');
    }
    if (dto.imageUrls.length > 10) {
      throw new BadRequestException('Maksimal 10 foto produk');
    }

    // Rate limit: max 10 listings/day
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const count = await this.productRepository.createQueryBuilder('p')
      .where('p.sellerId = :sellerId', { sellerId })
      .andWhere('p.createdAt >= :today', { today })
      .getCount();
    if (count >= 10) {
      throw new BadRequestException('Anda hanya dapat membuat maksimal 10 listing per hari');
    }

    const product = this.productRepository.create({ ...dto, sellerId, status: ProductStatus.PENDING_REVIEW });
    const saved = await this.productRepository.save(product);
    await this.cache.invalidatePattern('product:list:*');
    return saved;
  }

  async findAll(query: SearchProductDto) {
    const cacheKey = `product:list:${JSON.stringify(query)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const page = query.page || 1;
    const limit = query.limit || 20;
    const qb = this.productRepository.createQueryBuilder('p')
      .leftJoinAndSelect('p.fishSpecies', 'fish')
      .leftJoinAndSelect('p.seller', 'seller')
      .where('p.status = :status', { status: ProductStatus.APPROVED });

    if (query.search) {
      qb.andWhere('(p.title ILIKE :s OR fish.commonName ILIKE :s)', { s: `%${query.search}%` });
    }
    if (query.minPrice) qb.andWhere('p.price >= :min', { min: query.minPrice });
    if (query.maxPrice) qb.andWhere('p.price <= :max', { max: query.maxPrice });
    if (query.province) qb.andWhere('seller.province = :prov', { prov: query.province });
    if (query.fishSpeciesId) qb.andWhere('p.fishSpeciesId = :fid', { fid: query.fishSpeciesId });

    if (query.sortBy === 'price_asc') qb.orderBy('p.price', 'ASC');
    else if (query.sortBy === 'price_desc') qb.orderBy('p.price', 'DESC');
    else if (query.sortBy === 'rating') qb.orderBy('p.averageRating', 'DESC');
    else qb.orderBy('p.createdAt', 'DESC');

    qb.select(['p', 'fish.id', 'fish.commonName', 'fish.scientificName',
      'seller.id', 'seller.fullName', 'seller.shopName', 'seller.city', 'seller.province', 'seller.averageRating']);

    const [data, total] = await qb.skip((page - 1) * limit).take(limit).getManyAndCount();
    const result = { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    await this.cache.set(cacheKey, result, PRODUCT_LIST_TTL);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `product:detail:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const product = await this.productRepository.findOne({
      where: { id }, relations: ['fishSpecies', 'seller', 'reviews'],
    });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    await this.productRepository.increment({ id }, 'viewCount', 1);
    await this.cache.set(cacheKey, product, PRODUCT_DETAIL_TTL);
    return product;
  }

  async update(id: string, sellerId: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id, sellerId } });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    await this.productRepository.update(id, dto);
    await this.cache.del(`product:detail:${id}`);
    await this.cache.invalidatePattern('product:list:*');
    return this.findOne(id);
  }

  async remove(id: string, sellerId: string) {
    const product = await this.productRepository.findOne({ where: { id, sellerId } });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    await this.productRepository.update(id, { status: ProductStatus.DELETED });
    await this.cache.del(`product:detail:${id}`);
    await this.cache.invalidatePattern('product:list:*');
    return { message: 'Produk berhasil dihapus' };
  }

  async getSellerProducts(sellerId: string) {
    return this.productRepository.find({
      where: { sellerId }, relations: ['fishSpecies'], order: { createdAt: 'DESC' },
    });
  }
}

