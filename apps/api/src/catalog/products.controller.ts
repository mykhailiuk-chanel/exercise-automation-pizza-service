import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'List products',
    description:
      'Supports ?category=<slug> filtering and ?page/&pageSize pagination.',
  })
  @ApiOkResponse({ type: PaginatedProductsDto })
  findAll(@Query() query: ProductQueryDto): Promise<PaginatedProductsDto> {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a single product by slug' })
  @ApiOkResponse({ type: ProductResponseDto })
  findOne(@Param('slug') slug: string): Promise<ProductResponseDto> {
    return this.productsService.findBySlug(slug);
  }
}
