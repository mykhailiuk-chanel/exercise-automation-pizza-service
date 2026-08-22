import type { Metadata } from "next";
import { TEST_CARD_NUMBERS } from "@pizza/shared-types";
import { FeatureCard, type Feature } from "@/components/feature-card";

// TODO: replace with the real repo URL once this project is pushed to GitHub
// (see NEXT_STEPS.md / IMPLEMENTATION_PLAN.md — also referenced in the footer).
const GITHUB_URL = "https://github.com/YOUR_USERNAME/pizza-palace";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3053/api/v1";
const SWAGGER_URL = new URL(API_BASE_URL).origin + "/api/docs";

export const metadata: Metadata = {
  title: "For Testers | Pizza Palace",
  description:
    "Demo credentials, test card numbers, the Swagger API doc, and the automation-challenge feature list for Pizza Palace, a free QA automation practice site.",
};

const AUTOMATION_FEATURES: Feature[] = [
  {
    icon: "🖱️",
    title: "Drag & drop builder",
    description:
      "Build Your Own topping tray uses real HTML5 drag events — a naive synthetic mouse drag won't trigger the drop.",
  },
  {
    icon: "📜",
    title: "Infinite scroll",
    description:
      "The menu appends pages via IntersectionObserver, with a documented 'Load more' button as the accessible fallback.",
  },
  {
    icon: "🪗",
    title: "Animated accordion",
    description:
      "A real CSS grid-rows transition on the product page — assertions have to wait out the animation, not just read the DOM.",
  },
  {
    icon: "🔢",
    title: "CAPTCHA challenge",
    description:
      "Checkout gates on a simple math question you extract from the page and answer — practice for dynamic-value assertions.",
  },
  {
    icon: "🏷️",
    title: "Dual selectors",
    description:
      "Every interactive element ships both data-testid and qa-data attributes with the same value — pick whichever convention your framework expects.",
  },
  {
    icon: "💳",
    title: "Mock payments",
    description:
      "A deterministic Stripe-style test-card gateway — no real charge is ever made, no real gateway is ever contacted.",
  },
  {
    icon: "🛒",
    title: "Header-based cart",
    description:
      "Guest carts are identified via an X-Cart-Id header instead of a cookie — one line to reproduce from Postman.",
  },
  {
    icon: "🔐",
    title: "JWT auth",
    description:
      "Rotating refresh tokens — reusing an already-rotated token is rejected, matching real production auth behavior.",
  },
  {
    icon: "🚚",
    title: "Live order status",
    description:
      "An order's status advances on its own as real time passes — a genuine 'poll until it changes' target, no manual trigger needed.",
  },
  {
    icon: "📘",
    title: "Swagger API docs",
    description:
      "Every endpoint is public, versioned, and documented — import the OpenAPI JSON straight into Postman or RestAssured.",
  },
  {
    icon: "🛡️",
    title: "Admin RBAC",
    description:
      "A role-guarded admin panel for products, toppings, sizes, crusts, coupons, and order status overrides.",
  },
  {
    icon: "♻️",
    title: "One-call reset",
    description:
      "POST /api/test/reset wipes and reseeds the whole database to a known baseline — start every test run from a clean slate.",
  },
];

export default function ForTestersPage() {
  return (
    <main
      data-testid="for-testers-page"
      qa-data="for-testers-page"
      className="mx-auto w-full max-w-5xl flex-1 px-6 py-12"
    >
      <h1 className="text-3xl font-bold">For Testers</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Everything you need to start automating against this site — demo
        accounts, mock payment cards, the API docs, and the source code.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Demo accounts</h2>
        <table
          data-testid="for-testers-demo-credentials"
          qa-data="for-testers-demo-credentials"
          className="mt-2 w-full max-w-md text-left text-sm"
        >
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Password</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2 pr-4">Admin</td>
              <td className="py-2 pr-4">
                <code>admin@pizzapalace.test</code>
              </td>
              <td className="py-2 pr-4">
                <code>Admin123!</code>
              </td>
            </tr>
            <tr className="border-b border-zinc-100 dark:border-zinc-900">
              <td className="py-2 pr-4">Customer</td>
              <td className="py-2 pr-4">
                <code>customer@pizzapalace.test</code>
              </td>
              <td className="py-2 pr-4">
                <code>Customer123!</code>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Test card numbers</h2>
        <p
          data-testid="for-testers-test-card-numbers"
          qa-data="for-testers-test-card-numbers"
          className="mt-2 rounded bg-zinc-100 p-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
        >
          <code>{TEST_CARD_NUMBERS.SUCCESS}</code> succeeds,{" "}
          <code>{TEST_CARD_NUMBERS.DECLINED}</code> is declined,{" "}
          <code>{TEST_CARD_NUMBERS.INSUFFICIENT_FUNDS}</code> fails with
          insufficient funds. Any other well-formed 16-digit number succeeds.
          No real gateway is ever contacted.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">API docs &amp; source</h2>
        <ul className="mt-2 flex flex-col gap-2 text-sm">
          <li>
            <a
              href={SWAGGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="for-testers-swagger-link"
              qa-data="for-testers-swagger-link"
              className="font-medium underline underline-offset-4"
            >
              Public Swagger / OpenAPI docs
            </a>
          </li>
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="for-testers-github-link"
              qa-data="for-testers-github-link"
              className="font-medium underline underline-offset-4"
            >
              View source on GitHub
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">
          Automation-challenge features
        </h2>
        <ul
          data-testid="for-testers-feature-list"
          qa-data="for-testers-feature-list"
          className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {AUTOMATION_FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </ul>
      </section>
    </main>
  );
}
