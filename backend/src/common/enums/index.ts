export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum SellerVerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ProductStatus {
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAUSED = 'paused',
  DELETED = 'deleted',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  UNDER_REVIEW = 'under_review',
  REFUNDED = 'refunded',
}

export enum FishHabitat {
  FRESHWATER = 'freshwater',
  MARINE = 'marine',
  BRACKISH = 'brackish',
}

export enum CitesAppendix {
  I = 'I',
  II = 'II',
  III = 'III',
}

export enum ProductUnit {
  PCS = 'pcs',
  KG = 'kg',
  PAIR = 'pair',
}

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export enum ReportType {
  PRODUCT = 'product',
  USER = 'user',
  REVIEW = 'review',
}

