import { FunctionalComponent } from "preact";
import { Link } from "preact-router/match";
import { generateSlug } from "./utils"; // Assuming utils.ts is the utility file

export interface Card {
  link: string;
  imgSrc: string;
  description: string;
  detailedDescription: string;
  title: string;
  category: string; // Add the category property
  slug: string; // Add the slug property
}

interface FeatureCardProps extends Card {
  category: string; // Add category prop
  onClick: () => void;
}

export const FeatureCard: FunctionalComponent<FeatureCardProps> = ({
  category,
  imgSrc,
  title,
  description,
  onClick,
}) => {
  const categorySlug = generateSlug(category);
  const titleSlug = generateSlug(title);
  const href = `/detail${categorySlug ? `/${categorySlug}` : ""}${
    titleSlug ? `/${titleSlug}` : ""
  }`;

  return (
<Link href={href}>
      <Link href={href}></Link>
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
            <h3 className="mt-5 text-sm font-medium leading-6 text-black/75">
              {title}
            </h3>
            <p className="mt-2 text-sm text-black/65 line-clamp-2">
              {description}
            </p>
          </div>
        </article>
      </div>
    </Link>
  );
};
