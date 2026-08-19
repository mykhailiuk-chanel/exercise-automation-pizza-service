import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { AdminOrdersService } from './admin-orders.service';
import { AdminOrderSummaryResponseDto } from './dto/admin-order-summary.dto';
import { OrderStatusUpdateDto } from './dto/order-status-update.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List every order across all users' })
  @ApiOkResponse({ type: [AdminOrderSummaryResponseDto] })
  findAll(): Promise<AdminOrderSummaryResponseDto[]> {
    return this.adminOrdersService.findAll();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: "[Admin] Manually override an order's status" })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: OrderStatusUpdateDto,
  ): Promise<void> {
    await this.adminOrdersService.updateStatus(id, dto.status);
  }

  @Delete()
  @ApiOperation({ summary: '[Admin] Delete every order' })
  async removeAll(): Promise<void> {
    await this.adminOrdersService.removeAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete an order' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.adminOrdersService.remove(id);
  }
}
