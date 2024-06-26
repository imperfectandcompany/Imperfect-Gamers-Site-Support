import { useState } from "preact/hooks";
import { content } from "../content";

const Admin = () => {
  const [editMode, setEditMode] = useState<{ section: string, id: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleEdit = (section: string, id: string) => {
    setEditMode({ section, id });
  };

  const handleCloseEdit = () => {
    setEditMode(null);
  };

  const toggleSection = (sectionKey: string) => {
    if (activeSection === sectionKey) {
      setActiveSection(null);
    } else {
      setActiveSection(prevSection => (prevSection === sectionKey ? null : sectionKey));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mt-6">Admin Dashboard</h1>
      <section className="mt-8">
        <h2 className="text-xl font-bold text-indigo-600">Content Management</h2>
        {Object.keys(content.sections).map((sectionKey) => {
          const section = content.sections[sectionKey];
          const isActive = activeSection === sectionKey;
          return (
            <div key={sectionKey} className="mt-5">
              <button
                onClick={() => toggleSection(sectionKey)}
                className="flex justify-between items-center w-full text-left text-lg font-semibold text-indigo-500 py-2 transition duration-300 ease-in-out transform hover:scale-100 focus:outline-none"
              >
                {section.title} ({section.cards.length} Articles)
                <span className={`transform transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isActive ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="border-b border-gray-200">
                  {section.cards.map((card) => (
                    <div
                      key={card.link}
                      className="flex justify-between items-center mb-4 transition duration-300 ease-in-out transform"
                    >
                      <div>
                        <h4 className="font-medium text-lg">{card.title}</h4>
                        <p>{card.description}</p>
                      </div>
                      <button
                        onClick={() => handleEdit(sectionKey, card.link)}
                        className="text-indigo-500 hover:text-indigo-800 transition duration-300 ease-in-out"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-in-out">
          <div className="bg-white p-5 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out scale-105">
            <h2 className="text-xl mb-4">Edit {editMode.section}</h2>
            <button
              onClick={handleCloseEdit}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
