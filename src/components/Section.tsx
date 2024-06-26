/** src/components/Section.tsx **/

import { FunctionalComponent } from "preact";
import { FeatureCard } from "./FeatureCard";
import { Card } from "../content";

interface SectionData {
  title: string;
  category: string;
  cards: Card[];
}

interface SectionProps {
  data: SectionData;
  onCardClick: (item: Card) => void;
  searchQuery: string | null; // Add searchQuery prop
}

export const Section: FunctionalComponent<SectionProps> = ({
  data,
  onCardClick,
  searchQuery, // Add searchQuery prop
}) => {
  return (
    <section
      aria-labelledby={data.title
        .toLowerCase()
        .replace(/ & /g, "-")
        .replace(/ /g, "-")}
    >
      <h2 className="text-2xl font-semibold text-center mb-4">{data.title}</h2>
      {data.cards.map((card) => (
        <FeatureCard
          key={card.title}
          title={card.title}
          imgSrc={card.imgSrc} // Add the imgSrc value
          description={card.description} // Add the description value
          detailedDescription={card.detailedDescription} // Add the detailedDescription value
          category={card.category}
          slug={card.slug}
          matches={card.matches} // Pass matches prop
          searchQuery={searchQuery} // Pass searchQuery prop
          archived={false} // Add the archived property
          staffOnly={false} // Add the staffOnly property
          onClick={() => onCardClick(card)}
        />
      ))}
    </section>
  );
};
