import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SizesService } from './sizes.service';
import { SizeResponseDto } from './dto/size-response.dto';

@ApiTags('catalog-options')
@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Get()
  @ApiOperation({ summary: 'List pizza sizes' })
  @ApiOkResponse({ type: [SizeResponseDto] })
  findAll(): Promise<SizeResponseDto[]> {
    return this.sizesService.findAll();
  }
}
