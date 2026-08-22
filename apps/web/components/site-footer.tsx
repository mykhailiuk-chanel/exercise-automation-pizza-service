// TODO: replace with the real repo URL once this project is pushed to GitHub
// (see NEXT_STEPS.md / IMPLEMENTATION_PLAN.md — also referenced on /for-testers).
const GITHUB_URL = "https://github.com/YOUR_USERNAME/pizza-palace";

export function SiteFooter() {
  return (
    <footer
      data-testid="site-footer"
      qa-data="site-footer"
      className="border-t border-zinc-200 dark:border-zinc-800"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
        <span>Pizza Palace — a QA automation practice site.</span>
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
    </footer>
  );
}
