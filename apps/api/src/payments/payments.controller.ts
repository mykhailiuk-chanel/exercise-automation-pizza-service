import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ChargeAmountDto } from './dto/charge-card.dto';
import { ChargeResultDto } from './dto/charge-result.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('charge')
  @ApiOperation({
    summary: 'Run a card through the mock payment gateway in isolation',
    description:
      'Not tied to a cart or order — lets you explore success/decline/' +
      'insufficient-funds behavior directly. The real checkout flow ' +
      '(POST /orders/checkout) calls this same logic internally.',
  })
  @ApiOkResponse({ type: ChargeResultDto })
  charge(@Body() dto: ChargeAmountDto): ChargeResultDto {
    return this.paymentsService.charge(dto);
  }
}
