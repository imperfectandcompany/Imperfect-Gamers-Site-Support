// src/components/Header.tsx

import { FunctionalComponent } from "preact";
import { Link } from "preact-router/match";

interface HeaderProps {
  onSearchChange: (event: Event) => void;
  onLogoClick: () => void;
  onCategoryClick: () => void;
  searchQuery: string | null;
}

export const Header: FunctionalComponent<HeaderProps> = ({
  onSearchChange,
  onLogoClick,
  onCategoryClick,
  searchQuery,
}) => {
  return (
    <header className="flex flex-wrap items-end md:items-center justify-between px-4 py-3 ite shadow-sm sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="flex items-center cursor-pointer z-30">
        <Link href="/" onClick={onLogoClick}>
          <img
            alt="Imperfect Gamers Logo, a gaming community"
            src="https://cdn.imperfectgamers.org/inc/assets/img/logo.svg"
            className="h-10 sm:h-12"
          />
        </Link>
      </div>
      <div className="flex items-center space-x-4 mt-3 sm:mt-0">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery ?? ""}
          onInput={onSearchChange}
          className="block w-full max-w-xs h-10 px-4 py-2 text-indigo-300 border rounded-lg appearance-none focus:border-stone-300 focus:outline-none focus:ring-stone-300 sm:text-sm"

        />
        <Link
          href="/categories"
          className="flex items-center h-10 px-4 py-3 text-indigo-300 border rounded-lg appearance-none focus:border-stone-300 focus:outline-none focus:ring-stone-300 sm:text-sm transition duration-150 ease-in-out hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"

          onClick={onCategoryClick}
        >
          Categories
        </Link>
      </div>
    </header>
  );
};
