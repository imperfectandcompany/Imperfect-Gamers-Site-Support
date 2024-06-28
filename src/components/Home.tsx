// src/components/Home.tsx

import { Card, content } from "../content";
import { MainContent, SectionData } from "./MainContent";
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
  onBreadcrumbClickHome,
}: HomeProps) => {
  const filteredSections = Object.keys(content.sections).reduce<{
    [key: string]: SectionData;
  }>((acc, key) => {
    const section = content.sections[key as keyof typeof content.sections];
    const filteredCards = section.cards
      .map((card) => {
        const matches = {
          title: searchQuery ? card.versions.slice(-1)[0].title.toLowerCase().includes(searchQuery.toLowerCase()) : true,
          description: searchQuery ? card.versions.slice(-1)[0].description.toLowerCase().includes(searchQuery.toLowerCase()) : true,
          detailedDescription: searchQuery ? card.versions.slice(-1)[0].detailedDescription.toLowerCase().includes(searchQuery.toLowerCase()) : true,
        };
        return { ...card, matches };
      })
      .filter((card) => searchQuery ? Object.values(card.matches).some(Boolean) : true)
      .map((card) => ({ ...card, category: section.versions.slice(-1)[0].title }));

    if (filteredCards.length > 0) {
      acc[key] = { ...section, cards: filteredCards, title: section.versions.slice(-1)[0].title, category: "" };
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
        <Breadcrumb
          path={"/search"}
          onBreadcrumbClick={onBreadcrumbClick}
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
