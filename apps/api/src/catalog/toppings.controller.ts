import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ToppingsService } from './toppings.service';
import { ToppingResponseDto } from './dto/topping-response.dto';

@ApiTags('catalog-options')
@Controller('toppings')
export class ToppingsController {
  constructor(private readonly toppingsService: ToppingsService) {}

  @Get()
  @ApiOperation({ summary: 'List available toppings' })
  @ApiOkResponse({ type: [ToppingResponseDto] })
  findAll(): Promise<ToppingResponseDto[]> {
    return this.toppingsService.findAll();
  }
}
