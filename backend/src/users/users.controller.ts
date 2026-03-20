import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, SwitchRoleDto, SellerVerificationDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('api/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get profil user saat ini' })
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update profil user' })
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Post('switch-role')
  @ApiOperation({ summary: 'Switch role buyer/seller' })
  async switchRole(@Request() req: any, @Body() dto: SwitchRoleDto) {
    return this.usersService.switchRole(req.user.id, dto);
  }

  @Post('seller-verification')
  @ApiOperation({ summary: 'Request verifikasi seller (upload KTP + foto lokasi)' })
  async requestSellerVerification(@Request() req: any, @Body() dto: SellerVerificationDto) {
    return this.usersService.requestSellerVerification(req.user.id, dto);
  }

  @Post('wishlist/:productId')
  @ApiOperation({ summary: 'Tambah produk ke wishlist' })
  async addToWishlist(@Request() req: any, @Param('productId') productId: string) {
    return this.usersService.addToWishlist(req.user.id, productId);
  }

  @Delete('wishlist/:productId')
  @ApiOperation({ summary: 'Hapus produk dari wishlist' })
  async removeFromWishlist(@Request() req: any, @Param('productId') productId: string) {
    return this.usersService.removeFromWishlist(req.user.id, productId);
  }

  @Get('wishlist')
  @ApiOperation({ summary: 'Get daftar wishlist' })
  async getWishlist(@Request() req: any) {
    return this.usersService.getWishlist(req.user.id);
  }
}

