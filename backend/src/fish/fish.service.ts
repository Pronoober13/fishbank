import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { FishSpecies } from '../entities/fish-species.entity';
import { CreateFishDto, UpdateFishDto, SearchFishDto } from './dto/fish.dto';

@Injectable()
export class FishService {
  constructor(
    @InjectRepository(FishSpecies)
    private fishRepository: Repository<FishSpecies>,
  ) {}

  async create(dto: CreateFishDto) {
    const fish = this.fishRepository.create(dto);
    return this.fishRepository.save(fish);
  }

  async findAll(query: SearchFishDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.fishRepository.createQueryBuilder('fish');

    if (query.search) {
      qb.andWhere(
        '(fish.commonName ILIKE :search OR fish.scientificName ILIKE :search OR fish.localName ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.habitat) {
      qb.andWhere('fish.habitat = :habitat', { habitat: query.habitat });
    }

    if (query.province) {
      qb.andWhere('fish.distributionProvinces LIKE :province', {
        province: `%${query.province}%`,
      });
    }

    if (query.difficultyLevel) {
      qb.andWhere('fish.difficultyLevel = :difficultyLevel', {
        difficultyLevel: query.difficultyLevel,
      });
    }

    if (query.isProtected !== undefined) {
      qb.andWhere('fish.isProtected = :isProtected', {
        isProtected: query.isProtected,
      });
    }

    const [data, total] = await qb
      .orderBy('fish.commonName', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const fish = await this.fishRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!fish) throw new NotFoundException('Spesies ikan tidak ditemukan');
    return fish;
  }

  async update(id: string, dto: UpdateFishDto) {
    await this.findOne(id);
    await this.fishRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.fishRepository.delete(id);
    return { message: 'Spesies ikan berhasil dihapus' };
  }

  async getProtectedSpecies() {
    return this.fishRepository.find({ where: { isProtected: true } });
  }

  async isProtectedSpecies(id: string): Promise<boolean> {
    const fish = await this.fishRepository.findOne({ where: { id } });
    return fish?.isProtected ?? false;
  }
}

