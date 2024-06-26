// src/components/CategoryItems.tsx

import { FunctionalComponent } from 'preact';
import { Card, content } from '../content';
import { generateSlug } from '../utils';
import { FeatureCard } from './FeatureCard';
import Breadcrumb from './Breadcrumb';
import { AccessRestricted } from './AccessRestricted';
import { useMockAuth } from './models/userModel';

interface CategoryItemsProps {
  categorySlug: string;
}

export const CategoryItems: FunctionalComponent<
  CategoryItemsProps & { onCardClick: (item?: Card) => void }
> = ({ categorySlug, onCardClick }) => {
  const category = Object.values(content.sections).find(
    section => generateSlug(section.versions.slice(-1)[0].title) === categorySlug
  );

  if (!category) {
    return <AccessRestricted message="Category not found" />;
  }

  const { isStaff } = useMockAuth(); // Use the custom hook

  const userIsStaff = isStaff(); // Call the method to check if user is staff

const filteredCards = category.cards.filter(card => !card.archived && (!card.staffOnly || userIsStaff));

  return (
    <div>
      <Breadcrumb path={`/category/${categorySlug}`} categorySlug={categorySlug} />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
        {category.versions.slice(-1)[0].title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {filteredCards.map((card) => (
            <FeatureCard
            key={card.id} // Use card ID as key
            title={card.versions.slice(-1)[0].title}
              id={card.id} // Add the id property
              imgSrc={card.imgSrc}
              description={card.versions.slice(-1)[0].description}
              detailedDescription={card.versions.slice(-1)[0].detailedDescription}
              slug={card.slug}
              matches={card.matches}
              onClick={() => onCardClick(card)} // Use onCardClick with the card
              archived={card.archived} // Add the archived property
              staffOnly={card.staffOnly} // Add the staffOnly property
            />
          ))}
        </div>
      </div>
    </div>
  );
};
