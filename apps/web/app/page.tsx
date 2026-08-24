import Link from "next/link";
import { ApiWarmup } from "@/components/api-warmup";
import { FeatureCard, type Feature } from "@/components/feature-card";

const HOME_ACTIONS: Feature[] = [
  {
    icon: "🔍",
    title: "Manual & Exploratory Testing",
    description:
      "Click around, order a pizza, and try to break things — no setup required.",
  },
  {
    icon: "🤖",
    title: "Automated Test Scripts",
    description:
      "Write Selenium, Playwright, or Cypress tests against dual data-testid / qa-data selectors and real async flows.",
  },
  {
    icon: "🧠",
    title: "AI Agentic Testing",
    description:
      "Point an AI agent at the public OpenAPI spec and let it explore, order, and report multi-step scenarios on its own.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <ApiWarmup />
      <h1 className="text-4xl font-bold tracking-tight">
        A pizza shop for practicing test automation
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Browse the menu, build a pizza, and check out — all fake, all free,
        built for Selenium, Playwright, Cypress, and API test practice.
      </p>
      <Link
        href="/menu"
        data-testid="home-view-menu-link"
        qa-data="home-view-menu-link"
        className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
      >
        View the menu
      </Link>

      <h2 className="mt-16 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Ways to use this site
      </h2>
      <ul
        data-testid="home-action-cards"
        qa-data="home-action-cards"
        className="home-action-cards mt-4 grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3"
      >
        {HOME_ACTIONS.map((action) => (
          <FeatureCard
            key={action.title}
            {...action}
            testId="home-action-feature-card"
          />
        ))}
      </ul>
    </main>
  );
}
