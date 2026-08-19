import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Matches, Min } from 'class-validator';
import type { CardInput } from '@pizza/shared-types';

export class ChargeCardDto implements CardInput {
  @ApiProperty({
    description:
      'Digits only, no spaces. Use 4242424242424242 to force success, ' +
      '4000000000000002 to force a decline, or 4000000000009995 to force ' +
      'an insufficient-funds failure — any other well-formed 16-digit number succeeds.',
    example: '4242424242424242',
  })
  @IsString()
  @Matches(/^\d{13,19}$/, { message: 'number must be 13-19 digits' })
  number: string;

  @ApiProperty({ example: '12/34' })
  @IsString()
  expiry: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @Matches(/^\d{3,4}$/, { message: 'cvc must be 3-4 digits' })
  cvc: string;

  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  name: string;
}

export class ChargeAmountDto extends ChargeCardDto {
  @ApiProperty({ description: 'Amount to charge, in cents' })
  @IsInt()
  @Min(1)
  amountCents: number;
}
