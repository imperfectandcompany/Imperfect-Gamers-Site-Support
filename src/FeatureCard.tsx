import { FunctionalComponent } from "preact";

export interface Card {
  link: string;
  imgSrc: string;
  title: string;
  description: string;
  detailedDescription: string;
}

interface FeatureCardProps extends Card {
  onClick: () => void;
}

export const FeatureCard: FunctionalComponent<FeatureCardProps> = ({
  link,
  imgSrc,
  title,
  description,
  onClick,
}) => {
  return (
    <div
      className="clickable"
      href={link}
      onClick={onClick}
      aria-label={`Learn more about ${title}`}
    >
      <article className="card">
        <img
          alt={`Icon representing ${title}`}
          height="100"
          src={imgSrc}
          width="100"
        />
        <div className="card-content">
          <h3 className="mt-5 text-sm font-medium leading-6 text-black/75">{title}</h3>
          <p className="mt-2 text-sm text-black/65 line-clamp-2">{description}</p>
        </div>
      </article>
    </div>
  );
};
