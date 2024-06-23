// src/app.tsx

import { Router, route } from "preact-router";
import { useEffect, useReducer, useState } from "preact/hooks";
import { content } from "./content";
import { VNode } from "preact";
import Article from "./components/Article";
import { Categories } from "./components/Categories";
import { CategoryItems } from "./components/CategoryItems";
import { Card } from "./components/FeatureCard";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { SectionData, MainContent } from "./components/MainContent";
import { NotFound } from "./components/NotFound";


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

interface AppState {
  searchQuery: string;
  isSearching: boolean;
  selectedItem: Card | null;
  currentItemCount: number;
  lastRoute: string | null;
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
  lastRoute: null,
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
    case "UPDATE_LAST_ROUTE":
      return { ...state, lastRoute: action.value ?? null };
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

  const handleRouteChange = () => {
    const path = window.location.pathname;
    const queryParams = new URLSearchParams(window.location.search);
    const searchQueryFromURL = queryParams.get("query");

    if (path === "/" || path.startsWith("/article/")) {
      dispatch({ type: "CLEAR_SEARCH" });
      dispatch({ type: "STOP_SEARCH" });
    } else if (searchQueryFromURL) {
      dispatch({ type: "UPDATE_SEARCH", value: searchQueryFromURL });
      // Ensure the search input is pre-filled and search is initiated
      if (
        path.startsWith("/search") &&
        searchQueryFromURL !== state.searchQuery
      ) {
        dispatch({ type: "START_SEARCH", value: searchQueryFromURL });
      }
    } else {
      dispatch({ type: "STOP_SEARCH" });
    }
  };

  useEffect(() => {
    // Call handleRouteChange on mount to handle direct URL visits
    handleRouteChange();

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [state.searchQuery]);

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const queryParams = new URLSearchParams(window.location.search);
      const searchQueryFromURL = queryParams.get("query");
      if (path.startsWith("/search") && searchQueryFromURL) {
        dispatch({ type: "UPDATE_SEARCH", value: searchQueryFromURL });
      } else if (path === "/" || path.startsWith("/article/")) {
        dispatch({ type: "CLEAR_SEARCH" });
      }
      // Add any other route-specific logic here
    };

    // Call handleRouteChange on mount and on every popstate event
    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);

    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []); // Ensure this effect runs only once on mount and unmount

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
      dispatch({
        type: "UPDATE_LAST_ROUTE",
        value: window.location.pathname + window.location.search,
      });
      dispatch({ type: "SELECT_ITEM", item });
    }
  }

  function handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    // Unselect any selected item and ensure you leave the article view when typing begins
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


      <div class="flex flex-col w-full gap-2 mb-10">
      <div class="relative bg-gradient-to-b from-indigo-500 via-indigo-500/5 to-indigo-500/10 shadow-lg rounded-lg p-1 mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-4">

          <div className="bg-blue-900 text-white text-center p-4 rounded-lg">
            <button
              className="absolute top-3 right-3 text-indigo-300 hover:text-indigo-500"
              onClick={(e) => {
                const parentElement = e.currentTarget.parentElement;
                if (parentElement) {
                  const grandParentElement = parentElement.parentElement;
                  if (grandParentElement) {
                    grandParentElement.style.display = "none";
                  }
                }
              }}
            >
              &#x2715;
            </button>
            <p className="text-xs sm:text-sm md:text-base">
              <span className="font-medium text-indigo-50">Update:</span> <span className="text-indigo-100">Fri, Jun 21, 2024</span><br></br>
              This site is currently a work in progress. For immediate
              assistance, please visit our discord at{" "}
              <a href="https://imperfectgamers.org/discord/" class="text-indigo-300 hover:text-indigo-500">https://imperfectgamers.org/discord/</a>. 
            </p>
            <p class="text-right text-xs mt-1 sm:text-sm italic">
              - Imperfect Gamers Team
            </p>
          </div>
        </div>
      </div>

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
          <Article path="/article/:id" lastRoute={state.lastRoute || "/"} />
          <Categories path="/categories" />
          <CategoryItems
            path="/category/:categorySlug"
            categorySlug=""
            onCardClick={handleCardClick} // Pass handleCardClick to CategoryItems
          />
          <NotFound default />
        </Router>
      </main>
      <Footer />
    </div>
  );
}
