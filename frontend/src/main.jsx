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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2" style={{fontFamily: 'Jersey 25 Charted, cursive', fontVariationSettings: '"opsz" 25'}}>
            Daily Poetry Journal
          </h1>
          <div className="text-sm md:text-base text-gray-600" style={{fontFamily: 'Jersey 25 Charted, cursive'}}>
            Entry #{poemCount} • {lastUpdate}
          </div>
        </div>

        {/* Notebook Container */}
        <div className="flex justify-center">
          <div 
            className="bg-white notebook-paper shadow-2xl relative"
            style={{
              width: '210mm',
              height: '297mm',
              maxWidth: '90vw',
              maxHeight: '80vh',
              aspectRatio: '210/297',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            {/* Spiral binding holes */}
            <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-around py-4">
              {[...Array(25)].map((_, i) => (
                <div 
                  key={i}
                  className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300"
                />
              ))}
            </div>

            {/* Content Area */}
            <div className="h-full flex flex-col pt-8">
              {/* Title Area */}
              <div className="mb-4">
                <h2 className="handwritten-title">
                  Today's Poem
                </h2>
                <div className="handwritten text-sm text-gray-500 mb-4">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Poem Content */}
              <div className="flex-1 flex items-start justify-start pt-8">
                {isLoading ? (
                  <div className="handwritten animate-pulse">
                    Writing today's poem...
                  </div>
                ) : (
                  <div className="handwritten">
                    {formatPoem(currentPoem)}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pb-8 text-center">
                <button
                  onClick={generateNewPoem}
                  disabled={isLoading}
                  className="notebook-button px-6 py-3 text-sm disabled:opacity-50"
                >
                  {isLoading ? 'Writing...' : 'New Poem'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8 text-sm text-gray-500" style={{fontFamily: 'Jersey 25 Charted, cursive'}}>
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
