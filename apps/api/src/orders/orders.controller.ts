import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt.strategy';
import { CartId } from '../cart/cart-id.decorator';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiHeader({
    name: 'X-Cart-Id',
    required: true,
    description:
      'The same guest cart id used on /cart requests — checkout charges and clears that cart.',
  })
  @ApiOperation({
    summary: 'Charge the cart and place an order',
    description:
      'Requires login (for the shipping address + order history) plus the ' +
      'X-Cart-Id header identifying which guest cart to check out. On a ' +
      'successful mock charge, an order is created and the cart is cleared; ' +
      'on a declined charge, nothing is created and the cart is left intact.',
  })
  @ApiOkResponse({ type: OrderResponseDto })
  checkout(
    @CurrentUser() user: AuthenticatedUser,
    @CartId() cartId: string,
    @Body() dto: CheckoutDto,
  ): Promise<OrderResponseDto> {
    return this.ordersService.checkout(user.id, cartId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List your past orders, newest first' })
  @ApiOkResponse({ type: [OrderResponseDto] })
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<OrderResponseDto[]> {
    return this.ordersService.findAllForUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by id (must belong to you)' })
  @ApiOkResponse({ type: OrderResponseDto })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<OrderResponseDto> {
    return this.ordersService.findById(user.id, id);
  }
}
