import { useEffect, useState } from "preact/hooks";
import { content } from "../content";
import { FunctionalComponent } from "preact";
import { route } from "preact-router";
import Breadcrumb from "./Breadcrumb";
import { useMockAuth } from "./models/userModel";

export const AdminDashboard: FunctionalComponent = ({ }) => {
  const [editMode, setEditMode] = useState<{ section: string, id: number } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [cardStates, setCardStates] = useState(content.sections);
  const { isAuthenticated } = useMockAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      route('/admin'); // Redirect to dashboard if already logged in
    }
  }, []);


  const handleEdit = (id: number) => {
    // Correctly pass the article ID to the AdminEditArticle component
    route(`/admin/edit/${id}`);
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
    <div>
      <Breadcrumb path={`/admin`} />
      <div className="container relative px-8 py-16 mx-auto max-w-7xl md:px-12 lg:px-18 lg:py-22">
        <h1 className="text-3xl font-normal tracking-tighter text-black sm:text-4xl lg:text-5xl">
          Admin Dashboard
        </h1>

        <div className="mt-8">
  <button
    onClick={() => route('/admin/logs')}
    className="px-4 py-2 bg-indigo-500 text-white font-bold rounded hover:bg-indigo-600 transition duration-300 ease-in-out"
  >
    Visit Admin Logs
  </button>
  </div>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-indigo-600">Content Management</h2>
        {Object.keys(cardStates).map((sectionKey) => {
            const section = cardStates[sectionKey];
            const latestSectionVersion = section.versions.slice(-1)[0];
            const isActive = activeSection === sectionKey;
          return (
            <div key={sectionKey} className="mt-5">
                
              <button
                onClick={() => toggleSection(sectionKey)}
                className="flex justify-between items-center w-full text-left text-lg font-semibold text-indigo-500 py-2 transition duration-300 ease-in-out transform hover:scale-100 focus:outline-none"
              >
                  {latestSectionVersion.title} ({section.cards.length} Articles)
                <span className={`transform transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div className={`transition-max-height duration-500 ease-in-out overflow-hidden ${isActive ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="border-b border-gray-200">
                {section.cards.map((card, index) => {
                      const latestCardVersion = card.versions.slice(-1)[0];
                      return (
                    <div
                      key={index}
                      className={`flex justify-between items-center mb-4 transition duration-300 ease-in-out p-4 transform ${card.archived ? 'bg-stone-50' : ''} ${card.staffOnly ? 'border-l-4 border-indigo-600' : ''}`}
                    >
                      <div className='m2'>
                      <h4 className="font-medium text-lg">{latestCardVersion.title}</h4>
                      <p className='mt-1'>{latestCardVersion.description}</p>
                        <div className="flex space-x-4 text-sm mt-1">
                          <button
                            onClick={() => toggleArchive(sectionKey, index)}
                            className="text-indigo-500 hover:underline"
                          >
                            {card.archived ? 'Unarchive' : 'Archive'}
                          </button>
                          <button
                            onClick={() => toggleStaffOnly(sectionKey, index)}
                            className="text-indigo-500 hover:underline"
                          >
                            {card.staffOnly ? 'Make Public' : 'Make Staff Only'}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEdit(card.id)}
                        className="text-indigo-500 hover:text-indigo-800 transition duration-300 ease-in-out"
                      >
                        Edit
                      </button>
                    </div>
                      );
                    })}
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
    </div>
  );
};
