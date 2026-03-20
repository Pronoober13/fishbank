import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FishHabitat, CitesAppendix } from '../common/enums';
import { Product } from './product.entity';

@Entity('fish_species')
export class FishSpecies {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  commonName: string;

  @Column()
  scientificName: string;

  @Column({ nullable: true })
  localName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: FishHabitat })
  habitat: FishHabitat;

  @Column({ type: 'simple-array', nullable: true })
  distributionProvinces: string[];

  // Environment parameters
  @Column({ type: 'float', nullable: true })
  tempMin: number;

  @Column({ type: 'float', nullable: true })
  tempMax: number;

  @Column({ type: 'float', nullable: true })
  phMin: number;

  @Column({ type: 'float', nullable: true })
  phMax: number;

  @Column({ type: 'int', nullable: true })
  minTankSizeLiters: number;

  @Column({ type: 'float', nullable: true })
  maxSizeCm: number;

  // Behavior
  @Column({ type: 'text', nullable: true })
  dietDescription: string;

  @Column({ nullable: true })
  aggressiveness: string; // peaceful, semi-aggressive, aggressive

  @Column({ type: 'text', nullable: true })
  careTips: string;

  @Column({ nullable: true })
  difficultyLevel: string; // beginner, intermediate, advanced

  // Conservation
  @Column({ default: false })
  isProtected: boolean;

  @Column({ type: 'enum', enum: CitesAppendix, nullable: true })
  citesAppendix: CitesAppendix;

  @Column({ nullable: true })
  iucnStatus: string; // LC, NT, VU, EN, CR, EW, EX

  @Column({ type: 'text', nullable: true })
  protectionNote: string;

  // Media
  @Column({ nullable: true })
  primaryImageUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  galleryImageUrls: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.fishSpecies)
  products: Product[];
}

