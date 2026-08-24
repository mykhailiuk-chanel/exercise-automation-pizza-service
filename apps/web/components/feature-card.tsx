export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  testId = "for-testers-feature-card",
}: Feature & { testId?: string }) {
  return (
    <li
      data-testid={testId}
      qa-data={testId}
      className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <span aria-hidden="true" className="self-center text-2xl">
        {icon}
      </span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </li>
  );
}
