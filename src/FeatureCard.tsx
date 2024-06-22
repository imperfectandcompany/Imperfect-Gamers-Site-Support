import { FunctionalComponent } from "preact";
import { Link } from "preact-router/match";
import { generateSlug, highlightText } from "./utils"; // Assuming utils.ts is the utility file

export interface Card {
  link: string;
  imgSrc: string;
  description: string;
  detailedDescription: string;
  title: string;
  category: string; // Add the category property
  slug: string; // Add the slug property
  matches: {
    title: boolean;
    description: boolean;
    detailedDescription: boolean;
  };
}

interface FeatureCardProps extends Card {
  category: string; // Add category prop
  onClick: () => void;
  searchQuery: string; // Add searchQuery prop
}

export const FeatureCard: FunctionalComponent<FeatureCardProps> = ({
  category,
  imgSrc,
  title,
  description,
  matches,
  onClick,
  searchQuery,
}) => {
  const categorySlug = generateSlug(category);
  const titleSlug = generateSlug(title);
  const href = `/detail${categorySlug ? `/${categorySlug}` : ""}${
    titleSlug ? `/${titleSlug}` : ""
  }`;


  return (
    <Link href={href}>
      <div className="clickable" aria-label={`Learn more about ${title}`} onClick={onClick}>
        <article className="card">
          <img alt={`Icon representing ${title}`} height="100" src={imgSrc} width="100" />
          <div className="card-content">
            <h3 className="mt-5 text-sm font-medium leading-6 text-black/75" dangerouslySetInnerHTML={{ __html: matches.title ? highlightText(title, searchQuery) : title }}></h3>
            <p className="mt-2 text-sm text-black/65 line-clamp-2" dangerouslySetInnerHTML={{ __html: matches.description ? highlightText(description, searchQuery) : description }}></p>
          </div>
        </article>
      </div>
    </Link>
  );
};
