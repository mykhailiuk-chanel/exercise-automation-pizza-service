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
import { AdminProductsService } from './admin-products.service';
import { ProductInputDto } from './dto/product-input.dto';
import { ProductResponseDto } from '../catalog/dto/product-response.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  @ApiOperation({
    summary: '[Admin] List every product, including unavailable ones',
  })
  @ApiOkResponse({ type: [ProductResponseDto] })
  findAll(): Promise<ProductResponseDto[]> {
    return this.adminProductsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Create a product' })
  @ApiOkResponse({ type: ProductResponseDto })
  create(@Body() dto: ProductInputDto): Promise<ProductResponseDto> {
    return this.adminProductsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update a product' })
  @ApiOkResponse({ type: ProductResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: ProductInputDto,
  ): Promise<ProductResponseDto> {
    return this.adminProductsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete a product' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.adminProductsService.remove(id);
  }
}
