// src/components/Home.tsx

import { content } from "../content";
import { MainContent, SectionData } from "./MainContent";
import { Card } from "./FeatureCard";

interface HomeProps {
  path: string;
  onCardClick: (item?: Card) => void;
  searchQuery: string;
  isSearching: boolean;
  currentItemCount: number;
}

const Home = ({
  onCardClick,
  searchQuery,
  isSearching,
  currentItemCount,
}: HomeProps) => {
  const filteredSections = Object.keys(content.sections).reduce<{
    [key: string]: SectionData;
  }>((acc, key) => {
    const section = content.sections[key as keyof typeof content.sections];
    const filteredCards = section.cards
      .map((card) => {
        const matches = {
          title: card.title.toLowerCase().includes(searchQuery),
          description: card.description.toLowerCase().includes(searchQuery),
          detailedDescription: card.detailedDescription
            .toLowerCase()
            .includes(searchQuery),
        };
        return { ...card, matches };
      })
      .filter((card) => Object.values(card.matches).some(Boolean))
      .map((card) => ({ ...card, category: "" }));

    if (filteredCards.length > 0) {
      acc[key] = { ...section, cards: filteredCards, category: "" };
    }
    return acc;
  }, {});

  const totalResults = Object.values(filteredSections).reduce(
    (total, section) => total + section.cards.length,
    0
  );

  return (
    <MainContent
      sections={filteredSections}
      totalResults={totalResults}
      isSearching={isSearching}
      searchQuery={searchQuery}
      onCardClick={onCardClick}
      currentItemCount={currentItemCount}
    />
  );
};

export default Home;
