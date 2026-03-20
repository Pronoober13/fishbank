import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProductStatus, ProductUnit } from '../common/enums';
import { User } from './user.entity';
import { FishSpecies } from './fish-species.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: ProductUnit, default: ProductUnit.PCS })
  unit: ProductUnit;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  sizeInfo: string;

  @Column({ nullable: true })
  ageInfo: string;

  @Column({ type: 'simple-array', nullable: true })
  imageUrls: string[];

  @Column({ nullable: true })
  videoUrl: string;

  @Column({ nullable: true })
  pickupLocation: string;

  @Column({ type: 'simple-array', nullable: true })
  shippingMethods: string[];

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.PENDING_REVIEW })
  status: ProductStatus;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ default: 0 })
  viewCount: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @Column()
  sellerId: string;

  @ManyToOne(() => FishSpecies, (fish) => fish.products)
  @JoinColumn({ name: 'fishSpeciesId' })
  fishSpecies: FishSpecies;

  @Column()
  fishSpeciesId: string;

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

