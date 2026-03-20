import {
  IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FishHabitat, CitesAppendix } from '../../common/enums';

export class CreateFishDto {
  @ApiProperty() @IsString() commonName: string;
  @ApiProperty() @IsString() scientificName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() localName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: FishHabitat }) @IsEnum(FishHabitat) habitat: FishHabitat;
  @ApiPropertyOptional() @IsOptional() @IsArray() distributionProvinces?: string[];
  @ApiPropertyOptional() @IsOptional() @IsNumber() tempMin?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() tempMax?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() phMin?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() phMax?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() minTankSizeLiters?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() maxSizeCm?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() dietDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() aggressiveness?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() careTips?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() difficultyLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isProtected?: boolean;
  @ApiPropertyOptional({ enum: CitesAppendix }) @IsOptional() @IsEnum(CitesAppendix) citesAppendix?: CitesAppendix;
  @ApiPropertyOptional() @IsOptional() @IsString() iucnStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() protectionNote?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() primaryImageUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() galleryImageUrls?: string[];
}

export class UpdateFishDto extends CreateFishDto {}

export class SearchFishDto {
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ enum: FishHabitat }) @IsOptional() @IsEnum(FishHabitat) habitat?: FishHabitat;
  @ApiPropertyOptional() @IsOptional() @IsString() province?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() difficultyLevel?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isProtected?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

