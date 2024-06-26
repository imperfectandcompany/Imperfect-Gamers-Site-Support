/** src/components/MainContent.tsx **/

import { FunctionalComponent } from "preact";
import { SkeletonLoader } from "./SkeletonLoader";
import { Section } from "./Section";
import { route } from "preact-router";
import { generateSlug } from "../utils";
import { Card } from "../content";

export interface SectionData {
  title: string;
  cards: Card[];
  category: string; // Assuming category is of type string
}

interface MainContentProps {
  sections: { [key: string]: SectionData };
  totalResults: number;
  isSearching: boolean;
  searchQuery: string | null;
  onCardClick: (item: Card) => void;
  currentItemCount: number;
}

export const MainContent: FunctionalComponent<MainContentProps> = ({
  sections,
  totalResults,
  isSearching,
  searchQuery,
  onCardClick,
  currentItemCount,
}) => {
  let searchMessage = "Hi, how can we help you?";
  if (isSearching) {
    searchMessage = "Searching...";
  } else if (searchQuery || searchQuery === null) {
    searchMessage =
      totalResults === 0
        ? "No results found."
        : `Found ${totalResults} result${totalResults > 1 ? "s" : ""}.`;
  }




  const onCategoryClick = (event: MouseEvent) => {

  };

  return (
    <>
      <svg
        className="absolute blur-3xl right-0 opacity-80"
        width="50%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_17_60)">
          <g filter="url(#filter0_f_17_60)">
            <path
              d="M128.6 0H0V322.2L332.5 211.5L128.6 0Z"
              fill="#4D07E3"
            ></path>
            <path
              d="M0 322.2V400H240H320L332.5 211.5L0 322.2Z"
              fill="#4C00FF"
            ></path>
            <path
              d="M320 400H400V78.75L332.5 211.5L320 400Z"
              fill="#7fcef3"
            ></path>
            <path
              d="M400 0H128.6L332.5 211.5L400 78.75V0Z"
              fill="#7fcef3"
            ></path>
          </g>
        </g>
        <defs>
          <filter
            id="filter0_f_17_60"
            x="-159.933"
            y="-159.933"
            width="719.867"
            height="719.867"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            ></feBlend>
            <feGaussianBlur
              stdDeviation="79.9667"
              result="effect1_foregroundBlur_17_60"
            ></feGaussianBlur>
          </filter>
        </defs>
      </svg>
      <div className="container mx-auto relative px-8 py-16 max-w-7xl md:px-12 lg:px-18 lg:py-22">
        {searchQuery || searchQuery === null ? (
          <span className="text-xs font-medium tracking-widest text-transparent uppercase bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500">
            Help Center
          </span>
        ) : null}
        <p className={`mt-8 text-3xl ${isSearching && "transition animate-pulse"} font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl`}>
          {searchMessage}
        </p>
        <div className="additional-image mt-8" aria-hidden="true"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {isSearching ? (
            <SkeletonLoader sections={sections} count={currentItemCount} />
          ) : searchQuery ? (
            Object.values(sections).map((section) => (
              <Section
                key={section.title}
                data={section}
                onCardClick={onCardClick}
                searchQuery={searchQuery}
              />
            ))
          ) : (
            // Map categories directly here
            Object.keys(sections).map((category) => (
<div
  key={category}
  className="category-card bg-white hover:bg-blue-100 cursor-pointer shadow-md hover:shadow-lg rounded-lg p-4 transition duration-200 ease-in-out transform hover:-translate-y-1"
  onClick={() => route(`/category/${generateSlug(sections[category].title)}`)}
>
  <h3 className="text-xl font-bold text-gray-800">{sections[category].title}</h3>
  <p className="text-sm text-gray-600">{sections[category].cards.length} {sections[category].cards.length === 1 ? 'article' : 'articles'}</p>
</div>

            ))
          )}
        </div>
      </div>
    </>
  );
};
