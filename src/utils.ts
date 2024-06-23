// ~/utils.tsx

import { Card } from "./FeatureCard";
import { content } from "./content";

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/ /g, "-");
}

export function findCardBySlug(slug: string): Card | null {
  for (const section of Object.values(content.sections)) {
    const card = section.cards.find(
      (card) => generateSlug(card.title) === slug
    );
    if (card) {
      return card;
    }
  }
  return null;
}

export function highlightText(text: string, query: string): string {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts
    .map((part) =>
      part.toLowerCase() === query.toLowerCase()
        ? `<span class="highlight">${part}</span>`
        : part
    )
    .join("");
}
