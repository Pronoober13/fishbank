import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FishSpecies } from '../entities/fish-species.entity';
import { CreateFishDto, UpdateFishDto, SearchFishDto } from './dto/fish.dto';
import { RedisCacheService } from '../cache/redis-cache.service';

const FISH_DETAIL_TTL = 86400;    // 24 hours (BRD spec)
const FISH_LIST_TTL = 3600;       // 1 hour
const PROTECTED_TTL = 86400;      // 24 hours

@Injectable()
export class FishService {
  constructor(
    @InjectRepository(FishSpecies)
    private fishRepository: Repository<FishSpecies>,
    private cache: RedisCacheService,
  ) {}

  async create(dto: CreateFishDto) {
    const fish = this.fishRepository.create(dto);
    const saved = await this.fishRepository.save(fish);
    await this.cache.invalidatePattern('fish:*');
    return saved;
  }

  async findAll(query: SearchFishDto) {
    const cacheKey = `fish:list:${JSON.stringify(query)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

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
      qb.andWhere('fish.distributionProvinces LIKE :province', { province: `%${query.province}%` });
    }
    if (query.difficultyLevel) {
      qb.andWhere('fish.difficultyLevel = :difficultyLevel', { difficultyLevel: query.difficultyLevel });
    }
    if (query.isProtected !== undefined) {
      qb.andWhere('fish.isProtected = :isProtected', { isProtected: query.isProtected });
    }

    const [data, total] = await qb
      .orderBy('fish.commonName', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const result = { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    await this.cache.set(cacheKey, result, FISH_LIST_TTL);
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `fish:detail:${id}`;
    const cached = await this.cache.get<FishSpecies>(cacheKey);
    if (cached) return cached;

    const fish = await this.fishRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!fish) throw new NotFoundException('Spesies ikan tidak ditemukan');

    await this.cache.set(cacheKey, fish, FISH_DETAIL_TTL);
    return fish;
  }

  async update(id: string, dto: UpdateFishDto) {
    await this.findOne(id);
    await this.fishRepository.update(id, dto);
    await this.cache.del(`fish:detail:${id}`);
    await this.cache.invalidatePattern('fish:list:*');
    await this.cache.del('fish:protected');
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.fishRepository.delete(id);
    await this.cache.del(`fish:detail:${id}`);
    await this.cache.invalidatePattern('fish:list:*');
    await this.cache.del('fish:protected');
    return { message: 'Spesies ikan berhasil dihapus' };
  }

  async getProtectedSpecies() {
    const cacheKey = 'fish:protected';
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const result = await this.fishRepository.find({ where: { isProtected: true } });
    await this.cache.set(cacheKey, result, PROTECTED_TTL);
    return result;
  }

  async isProtectedSpecies(id: string): Promise<boolean> {
    const cacheKey = `fish:is_protected:${id}`;
    const cached = await this.cache.get<boolean>(cacheKey);
    if (cached !== null) return cached;

    const fish = await this.fishRepository.findOne({ where: { id } });
    const result = fish?.isProtected ?? false;
    await this.cache.set(cacheKey, result, PROTECTED_TTL);
    return result;
  }
}
