// ~/Header.tsx

import { FunctionalComponent } from 'preact';
import { Link } from 'preact-router/match';
import { content } from './content';

interface HeaderProps {
  onSearchChange: (event: Event) => void;
  onLogoClick: () => void;
  searchQuery: string;
}

export const Header: FunctionalComponent<HeaderProps> = ({
  onSearchChange,
  onLogoClick,
  searchQuery,
}) => {
  return (
    <header className="flex justify-between items-center px-4">
      <div className="flex items-center cursor-pointer z-30">
        <Link href="/">
          <img
            alt="Imperfect Gamers Logo, a gaming community"
            src="https://cdn.imperfectgamers.org/inc/assets/img/logo.svg"
            style={{ height: "60px" }}
            onClick={onLogoClick}
          />
        </Link>
      </div>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery} // Controlled input value
          onInput={onSearchChange} // Changed to onInput for Preact
          className="block w-full h-10 px-4 py-3 text-indigo-300 border rounded-lg appearance-none focus:border-stone-300 focus:outline-none focus:ring-stone-300 sm:text-sm pr-14"
        />
        <button
          className="flex items-center justify-center w-auto h-10 px-4 py-2 text-sm font-semibold text-white transition-all rounded-lg hover:to-indigo-600 bg-gradient-to-b from-indigo-300 via-indigo-400 to-indigo-500 outline-none"
          aria-label="Contact us for help"
        >
          <span>{content.header.contactUs}</span>
        </button>
      </div>
    </header>
  );
};
