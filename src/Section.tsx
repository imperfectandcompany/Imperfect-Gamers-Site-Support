import { FunctionalComponent } from "preact";
import { Card, FeatureCard } from "./FeatureCard";

interface SectionData {
  title: string;
  cards: Card[];
}

interface SectionProps {
  data: SectionData;
  onCardClick: (item: Card) => void;
}

export const Section: FunctionalComponent<SectionProps> = ({
  data,
  onCardClick,
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
          {...card}
          onClick={() => onCardClick(card)}
        />
      ))}
    </section>
  );
};
