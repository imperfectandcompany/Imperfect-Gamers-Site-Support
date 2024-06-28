/** src/utils.ts **/

import { Card, CardVersion, content } from "./content";

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


export function editCard(cardId: number, updatedFields: Partial<Card & { description?: string, title?: string, detailedDescription?: string }>): void {
  const card = findCardById(cardId);
  if (!card) return;

  const latestVersion = card.versions[card.versions.length - 1];
  const newVersion: CardVersion = {
    ...latestVersion,
    versionId: latestVersion.versionId + 1,
    editDate: new Date().toISOString(),
    changes: [],
  };

  if (updatedFields.title && updatedFields.title !== latestVersion.title) {
    newVersion.changes?.push(`Title changed from "${latestVersion.title}" to "${updatedFields.title}"`);
    newVersion.title = updatedFields.title;
  }

  if (updatedFields.description && updatedFields.description !== latestVersion.description) {
    newVersion.changes?.push(`Description changed`);
    newVersion.description = updatedFields.description;
  }

  if (updatedFields.detailedDescription && updatedFields.detailedDescription !== latestVersion.detailedDescription) {
    newVersion.changes?.push(`Detailed description changed`);
    newVersion.detailedDescription = updatedFields.detailedDescription;
  }

  if (updatedFields.category && updatedFields.category !== card.category) {
    newVersion.changes?.push(`Moved from category "${card.category}" to "${updatedFields.category}"`);
    card.category = updatedFields.category;
  }

  card.versions.push(newVersion);
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
