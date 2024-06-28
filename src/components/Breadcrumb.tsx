// src/components/Breadcrumb.tsx

import { FunctionalComponent } from 'preact';
import { Link } from 'preact-router';
import { Card, content } from '../content';
import { findCardById, findCardBySlug, generateSlug } from '../utils';


interface BreadcrumbProps {
  path: string;
  categorySlug?: string;
  articleId?: number;
  articleTitle?: string;
  onBreadcrumbClick?: () => void;
  onBreadcrumbClickHome?: () => void;
}

const Breadcrumb: FunctionalComponent<BreadcrumbProps> = ({
  path,
  categorySlug,
  articleId,
  articleTitle,
  onBreadcrumbClick,
  onBreadcrumbClickHome
}) => {
  let category = null;
  let article: Card | null = null;

  if (categorySlug) {
    category = Object.values(content.sections).find(
      section => generateSlug(section.versions.slice(-1)[0].title) === categorySlug
    );
  }

  if (articleTitle) {
    article = findCardBySlug(articleTitle);
    if (article && !category) {
      category = Object.values(content.sections).find(section =>
        section.cards.includes(article as Card)
      );
      if (category) {
        categorySlug = generateSlug(category.versions.slice(-1)[0].title);
      }
    }
  }

  const breadcrumbItems = [];

  breadcrumbItems.push(
    <li key="home" className="inline">
      <Link href="/" className="text-indigo-600 hover:text-indigo-800" onClick={onBreadcrumbClickHome}>Home</Link>
    </li>
  );
  

  if (path.startsWith("/search")) {
    breadcrumbItems.push(
      <li key="search" className="inline">
        <span className="mx-2 text-gray-500">/</span>
        <Link href="/search?query=" className="text-indigo-600 hover:text-indigo-800" onClick={onBreadcrumbClick}>Search</Link>
      </li>
    );
  }

  if (path.includes("/admin")) {
    breadcrumbItems.push(
      <li key="admin" className="inline">
        <span className="mx-2 text-gray-500">/</span>
        <Link href="/admin" className="text-indigo-600 hover:text-indigo-800" onClick={onBreadcrumbClick}>Admin</Link>
      </li>
    );
    
    if (path.includes("/edit")) {
      const card = articleId ? findCardById(articleId) : null;
      breadcrumbItems.push(
        <li key="edit" className="inline">
          <span className="mx-2 text-gray-500">/</span>
          <Link href={`/admin/edit/${articleId}`} className="text-indigo-600 hover:text-indigo-800" onClick={onBreadcrumbClick}>{card?.versions.slice(-1)[0].title}</Link>
        </li>
      );
    
      if (article && card) {
        breadcrumbItems.push(
          <li key={`article-${articleId}`} className="inline font-bold">
            <span className="mx-2 text-gray-500">/</span>
            {article.versions.slice(-1)[0].title}
          </li>
        );
      }
    }
  }


  if (path === "/categories" || category) {
    breadcrumbItems.push(
      <li key="categories" className="inline">
        <span className="mx-2 text-gray-500">/</span>
        <Link href="/categories" className="text-indigo-600 hover:text-indigo-800" onClick={onBreadcrumbClick}>Categories</Link>
      </li>
    );
  }

  if (category) {
    breadcrumbItems.push(
      <li key={`category-${categorySlug}`} className="inline">
        <span className="mx-2 text-gray-500">/</span>
        <Link href={`/category/${categorySlug}`} className="text-indigo-600 hover:text-indigo-800" onClick={onBreadcrumbClick}>{category.versions.slice(-1)[0].title}</Link>
      </li>
    );
  }

  if (article) {
    breadcrumbItems.push(
      <li key={`article-${articleTitle}`} className="inline font-bold">
        <span className="mx-2 text-gray-500">/</span>
        {article.versions.slice(-1)[0].title}
      </li>
    );
  }

  return (
    <div className="z-30 flex flex-col">
    <nav className="bg-white py-3 px-5 md:rounded-md my-4 opacity-80 z-30">
      <ul className="flex flex-wrap ml-2 md:ml-8 text-xs sm:text-sm md:text-md lg:text-lg text-gray-600">{breadcrumbItems}</ul>
    </nav>
    </div>
  );
};

export default Breadcrumb;
