import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole, SellerVerificationStatus } from '../common/enums';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Review } from './review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Column({ type: 'enum', enum: SellerVerificationStatus, nullable: true })
  sellerVerificationStatus: SellerVerificationStatus;

  @Column({ nullable: true })
  ktpUrl: string;

  @Column({ nullable: true })
  breedingLocationPhotoUrl: string;

  @Column({ nullable: true })
  shopName: string;

  @Column({ nullable: true })
  shopDescription: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  province: string;

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  totalReviews: number;

  @Column({ default: 0 })
  totalTransactions: number;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ nullable: true })
  banReason: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[];

  @OneToMany(() => Order, (order) => order.buyer)
  buyerOrders: Order[];

  @OneToMany(() => Order, (order) => order.seller)
  sellerOrders: Order[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviews: Review[];
}

