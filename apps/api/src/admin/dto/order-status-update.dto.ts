import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { OrderStatus } from '@pizza/shared-types';
import type {
  OrderStatus as OrderStatusType,
  OrderStatusUpdateInput,
} from '@pizza/shared-types';

export class OrderStatusUpdateDto implements OrderStatusUpdateInput {
  @ApiProperty({ enum: Object.values(OrderStatus) })
  @IsIn(Object.values(OrderStatus))
  status: OrderStatusType;
}
