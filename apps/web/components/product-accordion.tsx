"use client";

import { useState } from "react";

const SECTIONS = [
  {
    id: "nutrition",
    title: "Nutrition Facts",
    content:
      "Approx. 285 calories per slice (1/8 of a 12\" pizza): 11g fat, 34g carbohydrates, 12g protein, 640mg sodium. Values are illustrative demo data, not measured.",
  },
  {
    id: "allergens",
    title: "Allergens",
    content:
      "Contains wheat (gluten) and milk. May contain traces of soy. Prepared in a kitchen that also handles tree nuts and shellfish. Ask staff about substitutions for other allergies.",
  },
  {
    id: "faq",
    title: "FAQ",
    content:
      "Can I customize this pizza? Yes — use \"Build Your Own\" to start from scratch, or ask for topping swaps at checkout in the order notes. How long does delivery take? Orders are marked out for delivery within about a minute on this demo site.",
  },
] as const;

export function ProductAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
    setAnimatingId(id);
  }

  return (
    <div
      data-testid="product-accordion"
      qa-data="product-accordion"
      className="mt-8 flex flex-col gap-2"
    >
      {SECTIONS.map((section) => {
        const isOpen = openId === section.id;
        const isAnimating = animatingId === section.id;
        return (
          <div
            key={section.id}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800"
          >
            <button
              type="button"
              onClick={() => toggle(section.id)}
              aria-expanded={isOpen}
              data-testid="product-accordion-trigger"
              qa-data="product-accordion-trigger"
              data-section={section.id}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            >
              {section.title}
              <span
                aria-hidden
                className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            <div
              data-testid="product-accordion-panel"
              qa-data="product-accordion-panel"
              data-section={section.id}
              data-state={isOpen ? "open" : "closed"}
              data-animating={isAnimating}
              onTransitionEnd={() =>
                setAnimatingId((prev) => (prev === section.id ? null : prev))
              }
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 300ms ease",
              }}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-4 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
