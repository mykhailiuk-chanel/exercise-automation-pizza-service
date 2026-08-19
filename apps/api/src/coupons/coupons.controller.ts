import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import {
  PreviewCouponDto,
  CouponPreviewResponseDto,
} from './dto/coupon-preview.dto';

@ApiTags('coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('preview')
  @ApiOperation({
    summary: 'Check whether a coupon code is valid for a given subtotal',
    description:
      "Doesn't consume the coupon's usage — actual application happens at " +
      'checkout. Useful for showing a discount preview before placing an order.',
  })
  @ApiOkResponse({ type: CouponPreviewResponseDto })
  preview(@Body() dto: PreviewCouponDto): Promise<CouponPreviewResponseDto> {
    return this.couponsService.preview(dto.code, dto.subtotalCents);
  }
}
