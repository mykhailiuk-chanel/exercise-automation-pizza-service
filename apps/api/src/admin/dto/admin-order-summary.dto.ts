import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@pizza/shared-types';
import type {
  AdminOrderSummaryDto as AdminOrderSummary,
  OrderStatus as OrderStatusType,
} from '@pizza/shared-types';

export class AdminOrderSummaryResponseDto implements AdminOrderSummary {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userEmail: string;

  @ApiProperty({ enum: Object.values(OrderStatus) })
  status: OrderStatusType;

  @ApiProperty()
  totalCents: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ nullable: true })
  estimatedDeliveryAt: string | null;
}
