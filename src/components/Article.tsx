// src/components/Article.tsx

import { findCardBySlug, findCategoryById, generateSlug } from '../utils';
import { AccessRestricted } from './AccessRestricted';
import { ArticleView } from './ArticleView';
import Breadcrumb from './Breadcrumb';
import { useMockAuth } from './models/userModel';

interface ArticleProps {
  title?: string;
  path: string;
  lastRoute: string;
  onBreadcrumbClick: () => void;
}

const Article = ({ title, path, onBreadcrumbClick }: ArticleProps) => {
  const card = title ? findCardBySlug(title) : null;
  const { isStaff } = useMockAuth(); // Use the custom hook

  const userIsStaff = isStaff(); // Call the method to check if user is staff

  if (!card || card.archived || (card.staffOnly && !userIsStaff)) {
    return <AccessRestricted message="Article not available" />;
  }

 // Fetch the category details using the category ID
 const category = card.category ? findCategoryById(card.category) : null;
 const categorySlug = category ? generateSlug(category.versions.slice(-1)[0].title) : '';


  function handleBackAction() {
    history.back();
  }

  return (
    <div>
      <Breadcrumb path={path} categorySlug={categorySlug} articleTitle={title} onBreadcrumbClick={onBreadcrumbClick} />
      <ArticleView item={card} onBack={handleBackAction} />
    </div>
  );
};

export default Article;
