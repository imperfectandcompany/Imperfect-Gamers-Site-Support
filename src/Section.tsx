import { FunctionalComponent } from "preact";
import { FeatureCard } from "./FeatureCard";

interface Card {
  link: string;
  imgSrc: string;
  description: string;
  detailedDescription: string;
  title: string;
  category: string; // Add the category property
  slug: string; // Add the slug property
  matches: {
    title: boolean;
    description: boolean;
    detailedDescription: boolean;
  };
}

interface SectionData {
  title: string;
  category: string;
  cards: Card[];
}

interface SectionProps {
  data: SectionData;
  onCardClick: (item: Card) => void;
  searchQuery: string; // Add searchQuery prop
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
          link={card.link} // Add the link value
          imgSrc={card.imgSrc} // Add the imgSrc value
          description={card.description} // Add the description value
          detailedDescription={card.detailedDescription} // Add the detailedDescription value
          category={card.category}
          slug={card.slug}
          matches={card.matches} // Pass matches prop
          searchQuery={searchQuery} // Pass searchQuery prop
          onClick={() => onCardClick(card)}
        />
      ))}
    </section>
  );
};
