import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChargeResultDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  cardLast4: string;

  @ApiProperty()
  cardBrand: string;

  @ApiPropertyOptional({
    enum: ['card_declined', 'insufficient_funds'],
  })
  failureCode?: 'card_declined' | 'insufficient_funds';

  @ApiPropertyOptional()
  failureMessage?: string;
}
