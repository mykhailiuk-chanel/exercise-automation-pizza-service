import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminCouponsService } from './admin-coupons.service';
import { CouponInputDto, CouponResponseDto } from './dto/coupon.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/coupons')
export class AdminCouponsController {
  constructor(private readonly adminCouponsService: AdminCouponsService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List every coupon' })
  @ApiOkResponse({ type: [CouponResponseDto] })
  findAll(): Promise<CouponResponseDto[]> {
    return this.adminCouponsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a coupon' })
  @ApiOkResponse({ type: CouponResponseDto })
  create(@Body() dto: CouponInputDto): Promise<CouponResponseDto> {
    return this.adminCouponsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update a coupon' })
  @ApiOkResponse({ type: CouponResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: CouponInputDto,
  ): Promise<CouponResponseDto> {
    return this.adminCouponsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a coupon' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.adminCouponsService.remove(id);
  }
}
