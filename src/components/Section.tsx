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
      {data.cards.map((card) => {
        const latestVersion = card.versions[card.versions.length - 1];
        return (
        <FeatureCard
        key={latestVersion.title}
        id={card.id} // Add the id property
        title={latestVersion.title}
        imgSrc={card.imgSrc} // Add the imgSrc value
        description={latestVersion.description} // Add the description value
        detailedDescription={latestVersion.detailedDescription} // Add the detailedDescription value
        category={card.category}
          slug={card.slug}
          matches={card.matches} // Pass matches prop
          searchQuery={searchQuery} // Pass searchQuery prop
          archived={card.archived} // Add the archived property
          staffOnly={card.staffOnly} // Add the staffOnly property
          onClick={() => onCardClick(card)}
        />
      );
    })}
    </section>
  );
};
