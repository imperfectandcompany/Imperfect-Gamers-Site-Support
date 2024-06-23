// src/Article.tsx

import { findCardBySlug } from "../utils";
import { ArticleView } from "./ArticleView";

interface ArticleProps {
  id?: string;
  path: string;
  lastRoute: string;
}

const dev = true;

const Article = ({ id, lastRoute }: ArticleProps) => {
  const card = id ? findCardBySlug(id) : null;

  if (dev) {
    console.log(lastRoute);
  }

  if (!card) {
    return <p>Item not found</p>;
  }

  function handleBackAction() {
    if (dev) {
      console.log(lastRoute);
      console.log("Before navigating back:");
      console.log("History length:", window.history.length);
      console.log("Current URL:", window.location.href);
    }

    // Go back in history, which will now lead to the replaced state
    history.back();

    if (dev) {
      // Log after navigating back
      setTimeout(() => {
        console.log("After navigating back:");
        console.log("Current URL:", window.location.href);
      }, 500);
    }
  }

  return <ArticleView item={card} onBack={handleBackAction} />;
};

export default Article;
