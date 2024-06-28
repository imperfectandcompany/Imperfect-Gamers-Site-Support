/** src/utils.ts **/

import { Card, content } from "./content";

export function generateSlug(title: string): string {
  return title.toLowerCase().replace(/ /g, "-");
}

// This function now fetches the latest version of the card based on the slug.
export function findCardBySlug(slug: string): Card | null {
  for (const section of Object.values(content.sections)) {
    const card = section.cards.find(
      (card) => generateSlug(card.versions[card.versions.length - 1].title) === slug
    );
    if (card) {
      return card;
    }
  }
  return null;
}


export function findCardById(id: number): Card | null {
  for (const section of Object.values(content.sections)) {
    const card = section.cards.find(
      (card) => card.id === id
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

export const getElementPosition = (element: HTMLElement): { x: number, y: number } => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
};
