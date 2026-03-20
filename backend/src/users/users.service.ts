import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Wishlist } from '../entities/wishlist.entity';
import { UpdateProfileDto, SwitchRoleDto, SellerVerificationDto } from './dto/update-profile.dto';
import { UserRole, SellerVerificationStatus } from '../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    const { password, refreshToken, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.userRepository.update(userId, dto);
    return this.getProfile(userId);
  }

  async switchRole(userId: string, dto: SwitchRoleDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    if (dto.role === UserRole.SELLER && user.sellerVerificationStatus !== SellerVerificationStatus.APPROVED) {
      throw new BadRequestException('Anda harus terverifikasi sebagai seller terlebih dahulu');
    }

    if (dto.role === UserRole.ADMIN || dto.role === UserRole.MODERATOR) {
      throw new BadRequestException('Tidak dapat switch ke role ini');
    }

    await this.userRepository.update(userId, { role: dto.role });
    return this.getProfile(userId);
  }

  async requestSellerVerification(userId: string, dto: SellerVerificationDto) {
    await this.userRepository.update(userId, {
      ...dto,
      sellerVerificationStatus: SellerVerificationStatus.PENDING,
    });
    return this.getProfile(userId);
  }

  // Wishlist
  async addToWishlist(userId: string, productId: string) {
    const existing = await this.wishlistRepository.findOne({ where: { userId, productId } });
    if (existing) throw new BadRequestException('Produk sudah ada di wishlist');
    const wishlist = this.wishlistRepository.create({ userId, productId });
    return this.wishlistRepository.save(wishlist);
  }

  async removeFromWishlist(userId: string, productId: string) {
    await this.wishlistRepository.delete({ userId, productId });
    return { message: 'Produk dihapus dari wishlist' };
  }

  async getWishlist(userId: string) {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product', 'product.fishSpecies', 'product.seller'],
      order: { createdAt: 'DESC' },
    });
  }
}

