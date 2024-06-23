// src/components/FeatureCard.tsx

import { FunctionalComponent } from "preact";
import { Link } from "preact-router/match";
import { generateSlug, highlightText } from "../utils";


export interface Card {
  link: string;
  imgSrc: string;
  description: string;
  detailedDescription: string;
  title: string;
  category: string;
  slug: string;
  matches: {
    title: boolean;
    description: boolean;
    detailedDescription: boolean;
  };
}

interface FeatureCardProps extends Card {
  category: string;
  onClick: () => void;
  searchQuery: string;
}

export const FeatureCard: FunctionalComponent<FeatureCardProps> = ({
  category,
  imgSrc,
  title,
  description,
  matches,
  onClick,
  detailedDescription,
  searchQuery,
}) => {
  const categorySlug = generateSlug(category);
  const titleSlug = generateSlug(title);
  const href = `/article${categorySlug ? `/${categorySlug}` : ""}${
    titleSlug ? `/${titleSlug}` : ""
  }`;

  return (
    <Link href={href}>
      <div
        className="clickable"
        aria-label={`Learn more about ${title}`}
        onClick={onClick}
      >
        <article className="card">
          <img
            alt={`Icon representing ${title}`}
            height="100"
            src={imgSrc}
            width="100"
          />
          <div className="card-content">
            <h3
              className="mt-5 text-sm font-medium leading-6 text-black/75"
              dangerouslySetInnerHTML={{
                __html: matches.title
                  ? highlightText(title, searchQuery)
                  : title,
              }}
            ></h3>
            <p
              className="mt-2 text-sm text-black/65 line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: matches.description
                  ? highlightText(description, searchQuery)
                  : description,
              }}
            ></p>
            {searchQuery && matches.detailedDescription && (
              <div className="detail-match-indicator">
                <span className="text-sm text-blue-500">
                  Article details match
                </span>
                <div
                  className="tooltip"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(detailedDescription, searchQuery),
                  }}
                ></div>
              </div>
            )}
          </div>
        </article>
      </div>
    </Link>
  );
};
