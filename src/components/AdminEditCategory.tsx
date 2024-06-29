import { FunctionalComponent, h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { findCategoryById, updateCategory } from "../utils";
import { useMockAuth } from "./models/userModel";

interface CategoryProps {
  id: string;
}

const AdminEditCategory: FunctionalComponent<CategoryProps> = ({ id }) => {
  const { isAuthenticated } = useMockAuth();
  const [category, setCategory] = useState<{ id: number; title: string; description?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      route("/admin");
    } else {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await findCategoryById(parseInt(id));
      if (data) {
        setCategory(data);
      } else {
        setError('Category not found');
      }
    } catch (err) {
      setError('Failed to load category');
      console.error(err);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (category) {
      setLoading(true);
      const result = await updateCategory(category.id, { title: category.title, description: category.description });
      setLoading(false);
      if (result.success) {
        alert('Category updated successfully!');
      } else {
        setError('Failed to update category');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Edit Category</h1>
      {category ? (
        <form onSubmit={e => {
          e.preventDefault();
          handleSave();
        }}>
          <label>
            Title:
            <input type="text" value={category.title} onInput={e => setCategory({...category, title: e.currentTarget.value})} />
          </label>
          <label>
            Description:
            <textarea value={category.description || ''} onInput={e => setCategory({...category, description: e.currentTarget.value})} />
          </label>
          <button type="submit" disabled={loading}>Save Changes</button>
        </form>
      ) : <div>No category data</div>}
    </div>
  );
};

export default AdminEditCategory;
