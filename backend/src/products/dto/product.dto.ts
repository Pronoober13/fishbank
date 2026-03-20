import {
  IsString, IsOptional, IsNumber, IsArray, IsEnum, Min, Max, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductUnit } from '../../common/enums';

export class CreateProductDto {
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({ maxLength: 1000 })
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty({ enum: ProductUnit })
  @IsEnum(ProductUnit)
  unit: ProductUnit;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sizeInfo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ageInfo?: string;

  @ApiProperty({ description: 'Min 3, max 10 images' })
  @IsArray()
  imageUrls: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  shippingMethods?: string[];

  @ApiProperty()
  @IsString()
  fishSpeciesId: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) price?: number;
  @ApiPropertyOptional() @IsOptional() @IsEnum(ProductUnit) unit?: ProductUnit;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) stock?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() sizeInfo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ageInfo?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() imageUrls?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() videoUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pickupLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() shippingMethods?: string[];
}

export class SearchProductDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() minPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() maxPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() province?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fishSpeciesId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

