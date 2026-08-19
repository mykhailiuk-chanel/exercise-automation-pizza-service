// Plain `as const` objects + derived union types instead of TS `enum`:
// enums compile to real runtime code, which Node's native TypeScript
// type-stripping (used when running .ts files directly, e.g. via ts-node
// in strip-only mode) can't handle — only erasable syntax is supported.
export const OrderStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const UserRole = {
  CUSTOMER: "customer",
  ADMIN: "admin",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const CouponType = {
  PERCENT: "percent",
  FIXED: "fixed",
} as const;
export type CouponType = (typeof CouponType)[keyof typeof CouponType];

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface ToppingDto {
  id: string;
  name: string;
  category: "meat" | "veggie" | "cheese" | "sauce";
  priceModifierCents: number;
  available: boolean;
}

export interface SizeDto {
  id: string;
  name: string;
  priceModifierCents: number;
  sortOrder: number;
}

export interface CrustDto {
  id: string;
  name: string;
  priceModifierCents: number;
  sortOrder: number;
}

export interface ProductDto {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePriceCents: number;
  categoryId: string;
  imageUrl: string;
  isBuildYourOwnBase: boolean;
  available: boolean;
  ratingAverage: number;
  ratingCount: number;
  defaultToppingIds: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AddCartItemInput {
  productId: string;
  sizeId: string;
  crustId: string;
  toppingIds: string[];
  quantity: number;
}

export interface CartItemDto {
  id: string;
  productId: string;
  productName: string;
  sizeId: string;
  sizeName: string;
  crustId: string;
  crustName: string;
  toppingIds: string[];
  toppingNames: string[];
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface CartDto {
  id: string;
  items: CartItemDto[];
  itemCount: number;
  subtotalCents: number;
}

export interface OrderItemDto {
  productName: string;
  size: string;
  crust: string;
  toppings: string[];
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface OrderStatusHistoryEntryDto {
  status: OrderStatus;
  changedAt: string;
}

export interface OrderDto {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  couponCode: string | null;
  items: OrderItemDto[];
  statusHistory: OrderStatusHistoryEntryDto[];
  createdAt: string;
  estimatedDeliveryAt: string | null;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface AddressDto {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface AddressInput {
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface CardInput {
  number: string;
  expiry: string;
  cvc: string;
  name: string;
}

export interface CheckoutInput {
  addressId: string;
  card: CardInput;
  couponCode?: string;
}

export interface ReviewDto {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isOwn: boolean;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}

export interface CouponPreviewDto {
  valid: boolean;
  discountCents: number;
  message: string;
}

export interface ApiErrorShape {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
}

export interface CouponDto {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmountCents: number;
  maxUses: number | null;
  usesCount: number;
  expiresAt: string | null;
  active: boolean;
}

export interface CouponInput {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmountCents?: number;
  maxUses?: number | null;
  expiresAt?: string | null;
  active?: boolean;
}

export interface ProductInput {
  slug: string;
  name: string;
  description: string;
  basePriceCents: number;
  categoryId: string;
  imageUrl: string;
  isBuildYourOwnBase?: boolean;
  available?: boolean;
  defaultToppingIds?: string[];
}

export interface ToppingInput {
  name: string;
  category: "meat" | "veggie" | "cheese" | "sauce";
  priceModifierCents?: number;
  available?: boolean;
}

export interface SizeInput {
  name: string;
  priceModifierCents?: number;
  sortOrder?: number;
}

export interface CrustInput {
  name: string;
  priceModifierCents?: number;
  sortOrder?: number;
}

export interface OrderStatusUpdateInput {
  status: OrderStatus;
}

export interface AdminOrderSummaryDto {
  id: string;
  userEmail: string;
  status: OrderStatus;
  totalCents: number;
  createdAt: string;
  estimatedDeliveryAt: string | null;
}

/** Deterministic mock payment test-card numbers (Stripe-style convention). */
export const TEST_CARD_NUMBERS = {
  SUCCESS: "4242424242424242",
  DECLINED: "4000000000000002",
  INSUFFICIENT_FUNDS: "4000000000009995",
} as const;
