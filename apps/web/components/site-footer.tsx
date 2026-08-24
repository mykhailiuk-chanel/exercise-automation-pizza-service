const GITHUB_URL =
  "https://github.com/mykhailiuk-chanel/exercise-automation-pizza-service";

const FOUNDING_YEAR = 2026;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear > FOUNDING_YEAR
      ? `${FOUNDING_YEAR}–${currentYear}`
      : `${FOUNDING_YEAR}`;

  return (
    <footer
      data-testid="site-footer"
      qa-data="site-footer"
      className="border-t border-zinc-200 dark:border-zinc-800"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
        <p
          data-testid="site-footer-disclaimer"
          qa-data="site-footer-disclaimer"
          className="text-center text-xs text-zinc-500 dark:text-zinc-500"
        >
          This is a demo/practice website for QA automation training. No real
          orders, no real payments, no real pizza delivered.
        </p>
        <div className="mt-4 flex flex-col items-center gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:justify-between sm:gap-4">
          <span
            data-testid="site-footer-copyright"
            qa-data="site-footer-copyright"
          >
            © {yearRange} Pizza Palace · by{" "}
            <span
              data-testid="site-footer-author"
              qa-data="site-footer-author"
              className="font-medium"
            >
              Vitalii Mykhailiuk
            </span>
          </span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="site-footer-github-link"
            qa-data="site-footer-github-link"
            className="font-medium underline underline-offset-4"
          >
            View source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
