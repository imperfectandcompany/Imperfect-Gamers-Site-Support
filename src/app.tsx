import { Router, route } from "preact-router";
import { useEffect, useReducer, useState } from "preact/hooks";
import { Header } from "./Header";
import { MainContent, SectionData } from "./MainContent";
import { Footer } from "./Footer";
import { content } from "./content";
import { VNode } from "preact";
import { Card } from "./FeatureCard";
import Detail from "./Detail";

interface Section {
  title: string;
  cards: Card[];
}

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
      .filter(
        (card) =>
          card.title.toLowerCase().includes(searchQuery) ||
          card.description.toLowerCase().includes(searchQuery) ||
          card.detailedDescription.toLowerCase().includes(searchQuery)
      )
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

interface AppState {
  searchQuery: string;
  isSearching: boolean;
  selectedItem: Card | null;
  currentItemCount: number;
}

interface Action {
  type: string;
  value?: string;
  item?: Card | null;
}

const initialState: AppState = {
  searchQuery: "",
  isSearching: false,
  selectedItem: null,
  currentItemCount: 0,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "UPDATE_SEARCH":
      return { ...state, searchQuery: action.value ?? "", isSearching: true };
    case "CLEAR_SEARCH":
      return {
        ...state,
        searchQuery: "",
        isSearching: false,
        selectedItem: null,
      };
    case "SELECT_ITEM":
      return {
        ...state,
        selectedItem: action.item ?? null,
        isSearching: false,
        searchQuery: "",
      }; // Clear searchQuery when item is selected
    case "UNSELECT_ITEM":
      return { ...state, selectedItem: null };
    case "STOP_SEARCH":
      return { ...state, isSearching: false };
    default:
      return state;
  }
}

export function App(): VNode {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const queryParams = new URLSearchParams(window.location.search);
      const searchQueryFromURL = queryParams.get("query");

      if (path === "/" || path.startsWith("/detail/")) {
        dispatch({ type: "CLEAR_SEARCH" });
        dispatch({ type: "STOP_SEARCH" });
      } else if (searchQueryFromURL) {
        dispatch({ type: "UPDATE_SEARCH", value: searchQueryFromURL });
      } else {
        dispatch({ type: "STOP_SEARCH" });
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [state.searchQuery]);

  useEffect(() => {
    if (searchTimeout) {
      window.clearTimeout(searchTimeout);
    }

    if (state.searchQuery && !state.isSearching) {
      const timeoutId = window.setTimeout(() => {
        dispatch({ type: "STOP_SEARCH" });
        if (!state.selectedItem) {
          const currentURL = `/search?query=${state.searchQuery}`;
          if (
            window.location.pathname + window.location.search !==
            currentURL
          ) {
            route(currentURL);
          }
        }
      }, 500);

      setSearchTimeout(timeoutId);
      return () => window.clearTimeout(timeoutId);
    } else {
      dispatch({ type: "STOP_SEARCH" });
    }
  }, [state.searchQuery, state.selectedItem, state.isSearching]);

  function handleCardClick(item?: Card) {
    if (item) {
      dispatch({ type: "SELECT_ITEM", item });
      route(`/detail/${item.slug}`);
    }
  }

  function handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    // Unselect any selected item and ensure you leave the detail view when typing begins
    if (state.selectedItem) {
      dispatch({ type: "UNSELECT_ITEM" });
    }

    dispatch({ type: "UPDATE_SEARCH", value });

    // Navigate back to the home page if the search query is empty, else navigate to the search page
    if (value === "") {
      // Clear the search state and navigate to home
      dispatch({ type: "CLEAR_SEARCH" });
      route("/");
    } else {
      const newPath = `/search?query=${value}`;
      if (window.location.pathname + window.location.search !== newPath) {
        route(newPath);
      }
    }

    // Update the URL without navigating if already on the search page
    if (window.location.pathname.startsWith("/search") && value !== "") {
      history.replaceState({}, "", `/search?query=${value}`);
    } else if (value === "") {
      history.replaceState({}, "", "/");
    }
  }

  return (
    <div className="flex flex-col min-h-screen mx-auto py-8 max-w-screen-xl">
      <Header
        onSearchChange={handleSearchChange}
        onLogoClick={() => dispatch({ type: "CLEAR_SEARCH" })}
        searchQuery={state.searchQuery}
      />
      <main className="flex-1 relative">
        <Router>
          <Home
            path="/"
            onCardClick={handleCardClick}
            searchQuery={state.searchQuery}
            isSearching={state.isSearching}
            currentItemCount={state.currentItemCount}
          />
          <Home
            path="/search"
            onCardClick={handleCardClick}
            searchQuery={state.searchQuery}
            isSearching={state.isSearching}
            currentItemCount={state.currentItemCount}
          />
          <Detail path="/detail/:id" />
        </Router>
      </main>
      <Footer />
    </div>
  );
}
