export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: Feature) {
  return (
    <li
      data-testid="for-testers-feature-card"
      qa-data="for-testers-feature-card"
      className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <span aria-hidden="true" className="text-2xl">
        {icon}
      </span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </li>
  );
}
