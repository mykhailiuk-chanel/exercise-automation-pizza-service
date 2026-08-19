import { Injectable } from '@nestjs/common';
import { CaptchaChallengeResponseDto } from './dto/captcha-challenge.dto';

/**
 * Deliberately NOT cryptographically signed: the token is a plain base64
 * encoding of the two operands. The point of this challenge isn't real bot
 * prevention (this is a public practice site), it's giving testers a
 * dynamic value to read off the page and compute an assertion against,
 * instead of a hardcoded locator/value.
 */
@Injectable()
export class CaptchaService {
  generateChallenge(): CaptchaChallengeResponseDto {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const token = Buffer.from(JSON.stringify({ a, b })).toString('base64url');
    return { token, question: `What is ${a} + ${b}?` };
  }

  verify(token: string, answer: number): boolean {
    try {
      const decoded = JSON.parse(
        Buffer.from(token, 'base64url').toString('utf8'),
      ) as { a: unknown; b: unknown };
      return (
        typeof decoded.a === 'number' &&
        typeof decoded.b === 'number' &&
        answer === decoded.a + decoded.b
      );
    } catch {
      return false;
    }
  }
}
