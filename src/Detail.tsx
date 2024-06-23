// src/Detail.tsx
import { findCardBySlug } from "./utils"; // Assuming utils.ts is the utility file
import { DetailView } from "./DetailView";

interface DetailProps {
  id?: string;
  path: string;
  lastRoute: string;
}

const dev = true;

const Detail = ({ id, lastRoute }: DetailProps) => {
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

  return <DetailView item={card} onBack={handleBackAction} />;
};

export default Detail;
