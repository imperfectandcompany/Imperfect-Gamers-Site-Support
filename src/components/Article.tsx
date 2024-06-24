// src/components/Article.tsx

import { findCardBySlug, generateSlug } from '../utils';
import { ArticleView } from './ArticleView';
import Breadcrumb from './Breadcrumb';

interface ArticleProps {
  id?: string;
  path: string;
  lastRoute: string;
  onBreadcrumbClick: () => void;
}

const Article = ({ id, path, onBreadcrumbClick }: ArticleProps) => {
  const card = id ? findCardBySlug(id) : null;

  if (!card) {
    return <p>Item not found</p>;
  }

  const categorySlug = card.category ? generateSlug(card.category) : '';

  function handleBackAction() {
    history.back();
  }

  return (
    <div>
      <Breadcrumb path={path} categorySlug={categorySlug} articleId={id} onBreadcrumbClick={onBreadcrumbClick} />
      <ArticleView item={card} onBack={handleBackAction} />
    </div>
  );
};

export default Article;
