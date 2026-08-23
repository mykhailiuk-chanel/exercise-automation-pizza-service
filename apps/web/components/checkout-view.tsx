"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AddressDto, CartDto } from "@pizza/shared-types";
import { TEST_CARD_NUMBERS } from "@pizza/shared-types";
import { useAuth } from "@/components/auth-provider";
import { RequiredMark } from "@/components/required-mark";
import { fetchAddresses } from "@/lib/addresses-client";
import { fetchCart } from "@/lib/cart-client";
import { checkout } from "@/lib/orders-client";
import { previewCoupon } from "@/lib/coupons-client";
import { getCaptchaChallenge } from "@/lib/captcha-client";
import { formatCents } from "@/lib/format";

export function CheckoutView() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressDto[] | null>(null);
  const [cart, setCart] = useState<CartDto | null>(null);
  const [addressId, setAddressId] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountCents: number;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCaptcha = () => {
    getCaptchaChallenge().then((c) => {
      setCaptchaToken(c.token);
      setCaptchaQuestion(c.question);
      setCaptchaAnswer("");
    });
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/account/login?redirect=/checkout");
    }
  }, [isAuthLoading, user, router]);

  useEffect(loadCaptcha, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchAddresses(), fetchCart()]).then(([addrs, c]) => {
      setAddresses(addrs);
      setCart(c);
      const defaultAddress = addrs.find((a) => a.isDefault) ?? addrs[0];
      if (defaultAddress) setAddressId(defaultAddress.id);
    });
  }, [user]);

  async function handleApplyCoupon() {
    if (!couponInput.trim() || !cart) return;
    setIsCheckingCoupon(true);
    const result = await previewCoupon(couponInput.trim(), cart.subtotalCents);
    setCouponMessage(result.message);
    setAppliedCoupon(
      result.valid
        ? {
            code: couponInput.trim().toUpperCase(),
            discountCents: result.discountCents,
          }
        : null,
    );
    setIsCheckingCoupon(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const order = await checkout({
        addressId,
        card: { number: cardNumber, expiry, cvc, name: cardName },
        couponCode: appliedCoupon?.code,
        captcha: { token: captchaToken, answer: Number(captchaAnswer) },
      });
      router.push(`/checkout/confirmation/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      loadCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isAuthLoading || !user || !addresses || !cart) {
    return (
      <p
        data-testid="checkout-loading"
        qa-data="checkout-loading"
        className="mt-8"
      >
        Loading…
      </p>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div
        data-testid="checkout-empty-cart"
        qa-data="checkout-empty-cart"
        className="mt-8"
      >
        <p className="text-zinc-600 dark:text-zinc-400">Your cart is empty.</p>
        <Link
          href="/menu"
          className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div
        data-testid="checkout-no-addresses"
        qa-data="checkout-no-addresses"
        className="mt-8"
      >
        <p className="text-zinc-600 dark:text-zinc-400">
          You need a delivery address before checking out.
        </p>
        <Link
          href="/account/addresses"
          className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
        >
          Add an address
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
      <form
        onSubmit={handleSubmit}
        data-testid="checkout-form"
        qa-data="checkout-form"
        className="flex flex-col gap-6"
      >
        <fieldset>
          <legend className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Delivery address
          </legend>
          <div
            data-testid="checkout-address-options"
            qa-data="checkout-address-options"
            className="mt-2 flex flex-col gap-2"
          >
            {addresses.map((address) => (
              <label
                key={address.id}
                data-testid="checkout-address-option"
                qa-data="checkout-address-option"
                className="flex items-start gap-2 rounded border border-zinc-300 p-3 text-sm dark:border-zinc-700"
              >
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={addressId === address.id}
                  onChange={() => setAddressId(address.id)}
                  className="mt-1"
                />
                <span>
                  <strong>{address.label}</strong>
                  <br />
                  {address.street}, {address.city}, {address.state}{" "}
                  {address.zip}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Payment (mock — no real charge)
          </legend>
          <p
            data-testid="checkout-test-card-numbers"
            qa-data="checkout-test-card-numbers"
            className="mt-2 rounded bg-zinc-100 p-3 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
          >
            Test cards — <code>{TEST_CARD_NUMBERS.SUCCESS}</code> succeeds,{" "}
            <code>{TEST_CARD_NUMBERS.DECLINED}</code> is declined,{" "}
            <code>{TEST_CARD_NUMBERS.INSUFFICIENT_FUNDS}</code> fails with
            insufficient funds. Any other well-formed 16-digit number succeeds.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            <RequiredMark /> Required
          </p>
          <div className="mt-1 flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-500">
                Card number
                <RequiredMark />
              </span>
              <input
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                data-testid="checkout-card-number"
                qa-data="checkout-card-number"
                className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
              />
            </label>
            <div className="flex gap-3">
              <label className="flex w-1/2 flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-500">
                  Expiry (MM/YY)
                  <RequiredMark />
                </span>
                <input
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  data-testid="checkout-card-expiry"
                  qa-data="checkout-card-expiry"
                  className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
                />
              </label>
              <label className="flex w-1/2 flex-col gap-1 text-sm">
                <span className="font-medium text-zinc-500">
                  CVC
                  <RequiredMark />
                </span>
                <input
                  required
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  data-testid="checkout-card-cvc"
                  qa-data="checkout-card-cvc"
                  className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-500">
                Name on card
                <RequiredMark />
              </span>
              <input
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                data-testid="checkout-card-name"
                qa-data="checkout-card-name"
                className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Verification
          </legend>
          <p className="mt-2 text-xs text-zinc-500">
            Answer the question below to prove you&apos;re not a bot (this is a
            practice check, not real bot prevention — the answer is always
            computable from the question text).
          </p>
          <div className="mt-2 flex items-end gap-3">
            <label className="flex flex-1 flex-col gap-1 text-sm">
              <span
                data-testid="checkout-captcha-question"
                qa-data="checkout-captcha-question"
                className="font-medium text-zinc-500"
              >
                {captchaQuestion || "Loading…"}
                <RequiredMark />
              </span>
              <input
                required
                type="number"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                data-testid="checkout-captcha-answer"
                qa-data="checkout-captcha-answer"
                className="rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
              />
            </label>
          </div>
        </fieldset>

        {error && (
          <p
            data-testid="checkout-error"
            qa-data="checkout-error"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <p
          data-testid="checkout-disclaimer"
          qa-data="checkout-disclaimer"
          className="text-xs text-zinc-500"
        >
          Demo checkout — no real payment will be processed, no real order
          will be placed.
        </p>

        <button
          type="submit"
          disabled={isSubmitting || !addressId || !captchaToken}
          data-testid="checkout-place-order"
          qa-data="checkout-place-order"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background disabled:opacity-50"
        >
          {isSubmitting ? "Placing order…" : "Place Order"}
        </button>
      </form>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Order summary
        </h2>
        <ul
          data-testid="checkout-summary-items"
          qa-data="checkout-summary-items"
          className="mt-2 flex flex-col gap-2"
        >
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.productName} ({item.sizeName})
              </span>
              <span>{formatCents(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-zinc-200 pt-3 font-semibold dark:border-zinc-800">
          <span>Subtotal</span>
          <span
            data-testid="checkout-summary-subtotal"
            qa-data="checkout-summary-subtotal"
          >
            {formatCents(cart.subtotalCents)}
          </span>
        </div>
        {appliedCoupon && (
          <div className="mt-1 flex justify-between text-sm text-green-700 dark:text-green-500">
            <span>Discount ({appliedCoupon.code})</span>
            <span
              data-testid="checkout-coupon-discount"
              qa-data="checkout-coupon-discount"
            >
              -{formatCents(appliedCoupon.discountCents)}
            </span>
          </div>
        )}
        <p className="mt-2 text-xs text-zinc-500">
          Tax and delivery fee are calculated at checkout.
        </p>

        <div className="mt-6">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-zinc-500">Coupon code</span>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="e.g. WELCOME10"
                data-testid="checkout-coupon-input"
                qa-data="checkout-coupon-input"
                className="flex-1 rounded border border-zinc-300 px-3 py-1.5 dark:border-zinc-700 dark:bg-black"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isCheckingCoupon || !couponInput.trim()}
                data-testid="checkout-coupon-apply"
                qa-data="checkout-coupon-apply"
                className="rounded border border-zinc-300 px-4 text-sm font-medium disabled:opacity-50 dark:border-zinc-700"
              >
                {isCheckingCoupon ? "Checking…" : "Apply"}
              </button>
            </div>
          </label>
          {couponMessage && (
            <p
              data-testid="checkout-coupon-message"
              qa-data="checkout-coupon-message"
              className={`mt-2 text-sm ${appliedCoupon ? "text-green-700 dark:text-green-500" : "text-red-600"}`}
            >
              {couponMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
