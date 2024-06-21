import { useState, useEffect } from "preact/hooks";
import { Header } from "./Header";
import { MainContent } from "./MainContent";
import { DetailView } from "./DetailView";
import { Footer } from "./Footer";
import { content } from "./content";
import { VNode } from "preact";

interface Card {
  link: string;
  imgSrc: string;
  title: string;
  description: string;
  detailedDescription: string;
}

interface Section {
  title: string;
  cards: Card[];
}

export function App(): VNode {
  const [selectedItem, setSelectedItem] = useState<Card | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const [currentItemCount, setCurrentItemCount] = useState<number>(0);

  function handleCardClick(item: Card) {
    setSearchQuery("");
    setIsSearching(false);
    setSelectedItem(item);
  }

  function handleSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    setSearchQuery(value);
    setIsSearching(true);
    if (selectedItem) {
      setSelectedItem(null); // Reset selected item when typing
    }
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      window.setTimeout(() => {
        setIsSearching(false);
      }, 500)
    );
  }

  const filteredSections = Object.keys(content.sections).reduce<{
    [key: string]: Section;
  }>((acc, key) => {
    const section = content.sections[key as keyof typeof content.sections];
    const filteredCards = section.cards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchQuery) ||
        card.description.toLowerCase().includes(searchQuery) ||
        card.detailedDescription.toLowerCase().includes(searchQuery)
    );
    if (filteredCards.length > 0) {
      acc[key] = { ...section, cards: filteredCards };
    }
    return acc;
  }, {});

  const totalResults = Object.values(filteredSections).reduce(
    (total, section) => total + section.cards.length,
    0
  );

  useEffect(() => {
    if (!isSearching) {
      setCurrentItemCount(totalResults);
    }
  }, [totalResults, isSearching]);

  function resetView() {
    setSelectedItem(null);
    setSearchQuery("");
    setIsSearching(false);
  }

  return (
    <div className="flex flex-col min-h-screen mx-auto py-8 max-w-screen-xl">
      <div className="flex flex-col w-full gap-2 mb-10">
        {" "}
        <div className="ring-1 ring-inset ring-white/5  text-white bg-gradient-to-b from-indigo-500 via-indigo-500/5 shadow-2xl rounded-xl p-[0.060rem]">
          {" "}
          <div className="bg-blue-900 rounded-xl p-4">
            {" "}
            <h3 className="text-sm font-medium">
              Fri Jun 21, 2024 - This site is currently a work in progress. For
              immediate assistance, please visit our discord at
              https://imperfectgamers.org/discord/. Thank you. - Imperfect
              Gamers Team
            </h3>{" "}
          </div>{" "}
        </div>{" "}
      </div>

      <Header
        onSearchChange={handleSearchChange}
        onLogoClick={resetView}
        searchQuery={searchQuery}
      />
      <main className="flex-1 relative">
        {selectedItem ? (
          <DetailView item={selectedItem} onBack={() => resetView()} />
        ) : (
          <MainContent
            sections={filteredSections}
            totalResults={totalResults}
            isSearching={isSearching}
            searchQuery={searchQuery}
            onCardClick={handleCardClick}
            currentItemCount={currentItemCount}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
