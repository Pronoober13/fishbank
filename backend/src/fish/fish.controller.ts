import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FishService } from './fish.service';
import { CreateFishDto, UpdateFishDto, SearchFishDto } from './dto/fish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../common/enums';

@ApiTags('Fish Encyclopedia')
@Controller('api/fish')
export class FishController {
  constructor(private readonly fishService: FishService) {}

  @Get()
  @ApiOperation({ summary: 'Cari & filter spesies ikan' })
  async findAll(@Query() query: SearchFishDto) {
    return this.fishService.findAll(query);
  }

  @Get('protected')
  @ApiOperation({ summary: 'Daftar spesies ikan dilindungi' })
  async getProtected() {
    return this.fishService.getProtectedSpecies();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail spesies ikan' })
  async findOne(@Param('id') id: string) {
    return this.fishService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tambah spesies ikan baru (admin only)' })
  async create(@Body() dto: CreateFishDto) {
    return this.fishService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update spesies ikan (admin only)' })
  async update(@Param('id') id: string, @Body() dto: UpdateFishDto) {
    return this.fishService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus spesies ikan (admin only)' })
  async remove(@Param('id') id: string) {
    return this.fishService.remove(id);
  }
}

