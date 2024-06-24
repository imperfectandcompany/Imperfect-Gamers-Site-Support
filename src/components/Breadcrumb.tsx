// src/components/Breadcrumb.tsx

import { FunctionalComponent } from 'preact';
import { Link } from 'preact-router';
import { content } from '../content';
import { findCardBySlug, generateSlug } from '../utils';
import { Card } from './FeatureCard';

interface BreadcrumbProps {
  path: string;
  categorySlug?: string;
  articleId?: string;
  onBreadcrumbClick?: () => void;
  onBreadcrumbClickHome?: () => void;
}

const Breadcrumb: FunctionalComponent<BreadcrumbProps> = ({ path, categorySlug, articleId, onBreadcrumbClick, onBreadcrumbClickHome }) => {
  let category = null;
  let article: Card | null = null;

  if (categorySlug) {
    category = Object.values(content.sections).find(
      section => generateSlug(section.title) === categorySlug
    );
  }

  if (articleId) {
    article = findCardBySlug(articleId);
    if (article && !category) {
      category = Object.values(content.sections).find(section =>
        section.cards.includes(article as Card)
      );
      if (category) {
        categorySlug = generateSlug(category.title);
      }
    }
  }

  const breadcrumbItems = [];

  breadcrumbItems.push(
    <li key="home" className="inline">
      <Link href="/" onClick={onBreadcrumbClickHome}>Home</Link>
    </li>
  );

  if (path.startsWith("/search")) {
    breadcrumbItems.push(
      <li key="search" className="inline">
        <span> / </span>
        <Link href="/search?query=" onClick={onBreadcrumbClick}>Search</Link>
      </li>
    );
  }

  if (path === "/categories" || category) {
    breadcrumbItems.push(
      <li key="categories" className="inline">
        <span> / </span>
        <Link href="/categories" onClick={onBreadcrumbClick}>Categories</Link>
      </li>
    );
  }

  if (category) {
    breadcrumbItems.push(
      <li key={`category-${categorySlug}`} className="inline">
        <span> / </span>
        <Link href={`/category/${categorySlug}`} onClick={onBreadcrumbClick}>{category.title}</Link>
      </li>
    );
  }

  if (article) {
    breadcrumbItems.push(
      <li key={`article-${articleId}`} className="inline font-bold">
        <span> / </span>
        {article.title}
      </li>
    );
  }

  return (
    <div className="flex z-30">
      <nav className="breadcrumb text-gray-700 text-sm mb-4 z-30">
        <ul className="inline">{breadcrumbItems}</ul>
      </nav>
    </div>
  );
};

export default Breadcrumb;
