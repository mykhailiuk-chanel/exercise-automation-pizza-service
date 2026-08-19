import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all menu categories' })
  @ApiOkResponse({ type: [CategoryResponseDto] })
  findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }
}
