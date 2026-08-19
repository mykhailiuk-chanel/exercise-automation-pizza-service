import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import type {
  CaptchaAnswerInput,
  CaptchaChallengeDto,
} from '@pizza/shared-types';

export class CaptchaChallengeResponseDto implements CaptchaChallengeDto {
  @ApiProperty()
  token: string;

  @ApiProperty({ example: 'What is 4 + 7?' })
  question: string;
}

export class CaptchaAnswerDto implements CaptchaAnswerInput {
  @ApiProperty({
    description: 'The token from a prior GET /captcha/challenge response',
  })
  @IsString()
  token: string;

  @ApiProperty({ description: 'Your answer to the challenge question' })
  @Type(() => Number)
  @IsInt()
  answer: number;
}
