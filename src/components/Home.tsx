// src/components/Home.tsx

import { content } from "../content";
import { MainContent, SectionData } from "./MainContent";
import { Card } from "./FeatureCard";
import Breadcrumb from "./Breadcrumb";

interface HomeProps {
  path: string;
  onCardClick: (item?: Card) => void;
  onBreadcrumbClick: () => void;
  onBreadcrumbClickHome?: () => void;
  searchQuery: string | null;
  isSearching: boolean;
  currentItemCount: number;
}

const Home = ({
  onCardClick,
  searchQuery,
  isSearching,
  currentItemCount,
  path,
  onBreadcrumbClick,
  onBreadcrumbClickHome
}: HomeProps) => {
  const filteredSections = Object.keys(content.sections).reduce<{
    [key: string]: SectionData;
  }>((acc, key) => {
    const section = content.sections[key as keyof typeof content.sections];
    const filteredCards = section.cards
      .map((card) => {
        const matches = {
          title: ((searchQuery || searchQuery === "") && searchQuery !== null) ? card.title.toLowerCase().includes(searchQuery.toLowerCase()) : false,
          description: ((searchQuery || searchQuery === "") && searchQuery !== null) ? card.description.toLowerCase().includes(searchQuery.toLowerCase()) : false,
          detailedDescription: ((searchQuery || searchQuery === "") && searchQuery !== null) ? card.detailedDescription.toLowerCase().includes(searchQuery.toLowerCase()) : false,
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
    <div>
      {(path.startsWith("/search") || isSearching) && (
        <Breadcrumb path={"/search"} onBreadcrumbClick={onBreadcrumbClick}
        onBreadcrumbClickHome={onBreadcrumbClickHome}
        />
      )}
      <MainContent
        sections={filteredSections}
        totalResults={totalResults}
        isSearching={isSearching}
        searchQuery={searchQuery}
        onCardClick={onCardClick}
        currentItemCount={currentItemCount}
      />
    </div>
  );
};

export default Home;
