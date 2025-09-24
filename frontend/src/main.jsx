import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import '/index.css';

const App = () => {
  const [currentPoem, setCurrentPoem] = useState('');
  const [poemCount, setPoemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  // Load today's poem on component mount
  useEffect(() => {
    loadTodaysPoem();
  }, []);

  const loadTodaysPoem = async () => {
    setIsLoading(true);
    try {
      const poem = await backend.getCurrentPoem();
      const count = await backend.getPoemCount();
      const updateDate = await backend.getLastUpdateDate();
      
      setCurrentPoem(poem);
      setPoemCount(count);
      
      // Convert nanoseconds to readable date
      const date = new Date(Number(updateDate) * 24 * 60 * 60 * 1000);
      setLastUpdate(date.toLocaleDateString());
    } catch (e) {
      console.error('Error loading poem:', e);
      setCurrentPoem('Unable to load today\'s poem. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewPoem = async () => {
    setIsLoading(true);
    try {
      const newPoem = await backend.getDailyPoem();
      const count = await backend.getPoemCount();
      
      setCurrentPoem(newPoem);
      setPoemCount(count);
      
      const today = new Date();
      setLastUpdate(today.toLocaleDateString());
    } catch (e) {
      console.error('Error generating poem:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPoem = (poem) => {
    return poem.split('\n').map((line, index) => (
      <div key={index} className="mb-2 leading-relaxed">
        {line}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{fontFamily: 'Press Start 2P, monospace'}}>
            DAILY POETRY
          </h1>
          <div className="text-xs md:text-sm text-gray-600" style={{fontFamily: 'Press Start 2P, monospace'}}>
            Poem #{poemCount} • {lastUpdate}
          </div>
        </div>

        {/* A4 Paper Container */}
        <div className="flex justify-center">
          <div 
            className="bg-white pixel-paper shadow-2xl relative"
            style={{
              width: '210mm',
              height: '297mm',
              maxWidth: '90vw',
              maxHeight: '80vh',
              aspectRatio: '210/297',
              border: '2px solid #333',
              boxShadow: '8px 8px 0px rgba(0,0,0,0.3)'
            }}
          >
            {/* Paper holes */}
            <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-around">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white"
                />
              ))}
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-16 pl-16 md:pl-24 h-full flex flex-col">
              {/* Title Area */}
              <div className="mb-8 border-b-2 border-gray-300 pb-4">
                <h2 
                  className="text-lg md:text-xl text-center"
                  style={{fontFamily: 'Press Start 2P, monospace'}}
                >
                  TODAY'S POEM
                </h2>
              </div>

              {/* Poem Content */}
              <div className="flex-1 flex items-center justify-center">
                {isLoading ? (
                  <div className="text-center">
                    <div 
                      className="text-sm md:text-base animate-pulse"
                      style={{fontFamily: 'Press Start 2P, monospace'}}
                    >
                      Loading poem...
                    </div>
                  </div>
                ) : (
                  <div 
                    className="text-sm md:text-base leading-loose text-gray-800 text-center max-w-md"
                    style={{fontFamily: 'Press Start 2P, monospace'}}
                  >
                    {formatPoem(currentPoem)}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <button
                  onClick={generateNewPoem}
                  disabled={isLoading}
                  className="pixel-button px-6 py-3 text-xs md:text-sm disabled:opacity-50"
                  style={{fontFamily: 'Press Start 2P, monospace'}}
                >
                  {isLoading ? 'GENERATING...' : 'NEW POEM'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8 text-xs text-gray-600" style={{fontFamily: 'Press Start 2P, monospace'}}>
          Powered by Internet Computer AI
        </div>
      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
