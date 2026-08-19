import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import type { CheckoutInput } from '@pizza/shared-types';
import { ChargeCardDto } from '../../payments/dto/charge-card.dto';
import { CaptchaAnswerDto } from '../../captcha/dto/captcha-challenge.dto';

export class CheckoutDto implements CheckoutInput {
  @ApiProperty()
  @IsUUID()
  addressId: string;

  @ApiProperty({ type: ChargeCardDto })
  @ValidateNested()
  @Type(() => ChargeCardDto)
  card: ChargeCardDto;

  @ApiPropertyOptional({ example: 'WELCOME10' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiProperty({ type: CaptchaAnswerDto })
  @ValidateNested()
  @Type(() => CaptchaAnswerDto)
  captcha: CaptchaAnswerDto;
}
