// src/CategoryItems.tsx
import { FunctionalComponent } from "preact";
import { content } from "./content";
import { generateSlug } from "./utils";
import { Card, FeatureCard } from "./FeatureCard";

interface CategoryItemsProps {
  categorySlug: string;
}

export const CategoryItems: FunctionalComponent<
  CategoryItemsProps & { onCardClick: (item?: Card) => void }
> = ({ categorySlug, onCardClick }) => {
  const categoryKey = Object.keys(content.sections).find(
    (key) => generateSlug(content.sections[key].title) === categorySlug
  );

  if (!categoryKey) {
    return <p>Category not found</p>;
  }

  const category = content.sections[categoryKey];

  return (
    <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
      <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
        {category.title}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {category.cards.map((card) => (
          <FeatureCard
            key={card.title}
            title={card.title}
            link={card.link}
            imgSrc={card.imgSrc}
            description={card.description}
            detailedDescription={card.detailedDescription}
            category={card.category}
            slug={card.slug}
            matches={card.matches}
            searchQuery={""} // No search query in this context
            onClick={() => onCardClick(card)} // Use onCardClick with the card
          />
        ))}
      </div>
    </div>
  );
};
