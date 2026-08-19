import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CaptchaService } from './captcha.service';
import { CaptchaChallengeResponseDto } from './dto/captcha-challenge.dto';

@ApiTags('captcha')
@Controller('captcha')
export class CaptchaController {
  constructor(private readonly captchaService: CaptchaService) {}

  @Get('challenge')
  @ApiOperation({
    summary: 'Get a solvable bot-check challenge for checkout',
    description:
      'A simple arithmetic question. `token` encodes the two operands ' +
      "(plain base64, not signed — this isn't real bot prevention, it's " +
      'practice extracting a dynamic value from the page and computing an ' +
      'assertion). Submit `{ token, answer }` as `captcha` on ' +
      'POST /orders/checkout.',
  })
  @ApiOkResponse({ type: CaptchaChallengeResponseDto })
  getChallenge(): CaptchaChallengeResponseDto {
    return this.captchaService.generateChallenge();
  }
}
