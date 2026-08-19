import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrustsService } from './crusts.service';
import { CrustResponseDto } from './dto/crust-response.dto';

@ApiTags('catalog-options')
@Controller('crusts')
export class CrustsController {
  constructor(private readonly crustsService: CrustsService) {}

  @Get()
  @ApiOperation({ summary: 'List crust types' })
  @ApiOkResponse({ type: [CrustResponseDto] })
  findAll(): Promise<CrustResponseDto[]> {
    return this.crustsService.findAll();
  }
}
