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
    <header className="flex justify-between items-center px-4">
      <div className="flex items-center cursor-pointer z-30">
        <Link href="/" onClick={onLogoClick}>
          <img
            alt="Imperfect Gamers Logo, a gaming community"
            src="https://cdn.imperfectgamers.org/inc/assets/img/logo.svg"
            style={{ height: "60px" }}
          />
        </Link>
      </div>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery ?? ""} // Ensure value is a string
          onInput={onSearchChange} // Changed to onInput for Preact
          className="block w-full h-10 px-4 py-3 text-indigo-300 border rounded-lg appearance-none focus:border-stone-300 focus:outline-none focus:ring-stone-300 sm:text-sm pr-14"
        />
        <Link
          href="/categories"
          className="flex items-center h-10 px-4 py-3 text-indigo-300 border rounded-lg appearance-none focus:border-stone-300 focus:outline-none focus:ring-stone-300 sm:text-sm"
          onClick={onCategoryClick}
        >
          Categories
        </Link>
      </div>
    </header>
  );
};
