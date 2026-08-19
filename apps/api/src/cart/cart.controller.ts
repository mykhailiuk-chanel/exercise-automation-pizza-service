import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CartId } from './cart-id.decorator';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('cart')
@ApiHeader({
  name: 'X-Cart-Id',
  required: true,
  description:
    'Client-generated UUID v4 identifying a guest cart. Generate one ' +
    '(e.g. crypto.randomUUID()) and send the same value on every request ' +
    '— the cart is created automatically on first use, no login required.',
})
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current cart (empty if none exists yet)' })
  @ApiOkResponse({ type: CartResponseDto })
  getCart(@CartId() cartId: string): Promise<CartResponseDto> {
    return this.cartService.getCart(cartId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiOkResponse({ type: CartResponseDto })
  addItem(
    @CartId() cartId: string,
    @Body() dto: AddCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addItem(cartId, dto);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update a cart item quantity' })
  @ApiOkResponse({ type: CartResponseDto })
  updateItem(
    @CartId() cartId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateItemQuantity(cartId, itemId, dto.quantity);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiOkResponse({ type: CartResponseDto })
  removeItem(
    @CartId() cartId: string,
    @Param('itemId') itemId: string,
  ): Promise<CartResponseDto> {
    return this.cartService.removeItem(cartId, itemId);
  }

  @Delete()
  @ApiOperation({ summary: 'Remove all items from the cart' })
  @ApiOkResponse({ type: CartResponseDto })
  clearCart(@CartId() cartId: string): Promise<CartResponseDto> {
    return this.cartService.clearCart(cartId);
  }
}
