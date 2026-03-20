import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FishService } from './fish.service';
import { FishController } from './fish.controller';
import { FishSpecies } from '../entities/fish-species.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FishSpecies])],
  controllers: [FishController],
  providers: [FishService],
  exports: [FishService],
})
export class FishModule {}

