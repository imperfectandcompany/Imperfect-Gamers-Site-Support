// src/Detail.tsx
import { findCardBySlug } from "./utils"; // Assuming utils.ts is the utility file
import { DetailView } from "./DetailView";

interface DetailProps {
  id?: string;
  path: string;
}

const Detail = ({ id }: DetailProps) => {
  const card = id ? findCardBySlug(id) : null;

  if (!card) {
    return <p>Item not found</p>;
  }

  return <DetailView item={card} onBack={() => history.back()} />;
};

export default Detail;
