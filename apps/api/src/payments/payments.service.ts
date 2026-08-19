import { Injectable } from '@nestjs/common';
import { TEST_CARD_NUMBERS } from '@pizza/shared-types';
import { ChargeCardDto } from './dto/charge-card.dto';
import { ChargeResultDto } from './dto/charge-result.dto';

/**
 * Mock payment gateway — never touches a real payment rail. Deterministic
 * Stripe-style test card numbers let automation suites assert on specific
 * success/failure paths; any other well-formed card number succeeds so
 * exploratory testers aren't blocked.
 */
@Injectable()
export class PaymentsService {
  charge(card: ChargeCardDto): ChargeResultDto {
    const cardLast4 = card.number.slice(-4);
    const cardBrand = 'Visa';

    if (card.number === TEST_CARD_NUMBERS.DECLINED) {
      return {
        success: false,
        cardLast4,
        cardBrand,
        failureCode: 'card_declined',
        failureMessage: 'Your card was declined.',
      };
    }
    if (card.number === TEST_CARD_NUMBERS.INSUFFICIENT_FUNDS) {
      return {
        success: false,
        cardLast4,
        cardBrand,
        failureCode: 'insufficient_funds',
        failureMessage: 'Your card has insufficient funds.',
      };
    }
    return { success: true, cardLast4, cardBrand };
  }
}
