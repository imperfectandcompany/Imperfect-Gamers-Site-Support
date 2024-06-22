import { Card } from "./FeatureCard";
import { content } from "./content";


export function generateSlug(title: string): string {
    return title.toLowerCase().replace(/ /g, '-');
  }
  
  export function findCardBySlug(slug: string): Card | null {
    for (const section of Object.values(content.sections)) {
      const card = section.cards.find((card) => generateSlug(card.title) === slug);
      if (card) {
        return card;
      }
    }
    return null;
  }
  