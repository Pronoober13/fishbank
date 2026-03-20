import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../common/enums';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string;
}

export class SwitchRoleDto {
  @ApiPropertyOptional({ enum: [UserRole.BUYER, UserRole.SELLER] })
  @IsEnum(UserRole)
  role: UserRole;
}

export class SellerVerificationDto {
  @ApiPropertyOptional()
  @IsString()
  ktpUrl: string;

  @ApiPropertyOptional()
  @IsString()
  breedingLocationPhotoUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shopName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shopDescription?: string;
}

