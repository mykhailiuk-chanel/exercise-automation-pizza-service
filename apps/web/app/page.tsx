import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
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
    </main>
  );
}
