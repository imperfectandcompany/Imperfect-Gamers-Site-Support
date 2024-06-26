import { useState } from "preact/hooks";
import { content } from "../content";
import { FunctionalComponent } from "preact";

export const Admin: FunctionalComponent = ({ }) => {
  const [editMode, setEditMode] = useState<{ section: string, id: number } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [cardStates, setCardStates] = useState(content.sections);

  const handleEdit = (section: string, id: number) => {
    setEditMode({ section, id });
  };

  const handleCloseEdit = () => {
    setEditMode(null);
  };

  const toggleSection = (sectionKey: string) => {
    setActiveSection(prevSection => (prevSection === sectionKey ? null : sectionKey));
  };

  const toggleArchive = (sectionKey: string, cardIndex: number) => {
    setCardStates(prevStates => {
      const newState = { ...prevStates };
      const section = newState[sectionKey];
      const card = section.cards[cardIndex];
      card.archived = !card.archived;
      return newState;
    });
  };

  const toggleStaffOnly = (sectionKey: string, cardIndex: number) => {
    setCardStates(prevStates => {
      const newState = { ...prevStates };
      const section = newState[sectionKey];
      const card = section.cards[cardIndex];
      card.staffOnly = !card.staffOnly;
      return newState;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mt-6">Admin Dashboard</h1>
      <section className="mt-8">
        <h2 className="text-xl font-bold text-indigo-600">Content Management</h2>
        {Object.keys(cardStates).map((sectionKey) => {
          const section = cardStates[sectionKey];
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
                  {section.cards.map((card, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center mb-4 transition duration-300 ease-in-out p-4 transform ${card.archived ? 'bg-stone-200' : ''} ${card.staffOnly ? 'border-l-4 border-blue-600' : ''}`}
                    >
                      <div className='m2'>
                        <h4 className="font-medium text-lg">{card.title}</h4>
                        <p className={'mt-'}>{card.description}</p>
                        <div className="flex space-x-4 text-sm mt-1">
                          <button
                            onClick={() => toggleArchive(sectionKey, index)}
                            className="text-blue-500 hover:underline"
                          >
                            {card.archived ? 'Unarchive' : 'Archive'}
                          </button>
                          <button
                            onClick={() => toggleStaffOnly(sectionKey, index)}
                            className="text-blue-500 hover:underline"
                          >
                            {card.staffOnly ? 'Make Public' : 'Make Staff Only'}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEdit(sectionKey, index)}
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
