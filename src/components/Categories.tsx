// src/components/Categories.tsx

import { Link } from 'preact-router';
import { content } from '../content';
import { generateSlug } from '../utils';
import Breadcrumb from './Breadcrumb';

export const Categories = ({ path, onBreadcrumbClick }: { path: string, onBreadcrumbClick: () => void }) => {
  const categories = Object.keys(content.sections).map(
    (key: keyof typeof content.sections) => ({
      title: content.sections[key].title,
      slug: generateSlug(
        content.sections[key as keyof typeof content.sections].title
      ),
    })
  );

  return (
    <div>
      <Breadcrumb path={path} onBreadcrumbClick={onBreadcrumbClick} />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          Categories
        </h1>
        <ul className="mt-8">
          {categories.map((category) => (
            <li key={category.slug} className="mb-4">
              <Link
                href={`/category/${category.slug}`}
                className="text-indigo-500 hover:underline"
                onClick={onBreadcrumbClick}
              >
                {category.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
