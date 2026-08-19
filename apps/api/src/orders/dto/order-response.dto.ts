import { ApiProperty } from '@nestjs/swagger';
import type {
  OrderDto,
  OrderItemDto,
  OrderStatus,
  OrderStatusHistoryEntryDto,
  PaymentStatus,
} from '@pizza/shared-types';

const ORDER_STATUS_VALUES = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;

export class OrderStatusHistoryEntryResponseDto implements OrderStatusHistoryEntryDto {
  @ApiProperty({ enum: ORDER_STATUS_VALUES })
  status: OrderStatus;

  @ApiProperty()
  changedAt: string;
}

export class OrderItemResponseDto implements OrderItemDto {
  @ApiProperty()
  productName: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  crust: string;

  @ApiProperty({ type: [String] })
  toppings: string[];

  @ApiProperty()
  unitPriceCents: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  lineTotalCents: number;
}

export class OrderResponseDto implements OrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ORDER_STATUS_VALUES })
  status: OrderStatus;

  @ApiProperty({ enum: ['pending', 'succeeded', 'failed'] })
  paymentStatus: PaymentStatus;

  @ApiProperty()
  subtotalCents: number;

  @ApiProperty()
  discountCents: number;

  @ApiProperty()
  taxCents: number;

  @ApiProperty()
  deliveryFeeCents: number;

  @ApiProperty()
  totalCents: number;

  @ApiProperty({ nullable: true })
  couponCode: string | null;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ type: [OrderStatusHistoryEntryResponseDto] })
  statusHistory: OrderStatusHistoryEntryResponseDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ nullable: true })
  estimatedDeliveryAt: string | null;
}
