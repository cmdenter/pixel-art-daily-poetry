import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import '/index.css';

const App = () => {
  const [currentPoem, setCurrentPoem] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [poemCount, setPoemCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState('');

  // Load today's poem on component mount
  useEffect(() => {
    loadTodaysPoem();
  }, []);

  const loadTodaysPoem = async () => {
    try {
      const poemData = await backend.getCurrentPoem();
      const count = await backend.getPoemCount();
      const updateDate = await backend.getLastUpdateDate();
      
      setCurrentPoem(poemData.poem);
      setCurrentTitle(poemData.title);
      setPoemCount(count);
      
      // Convert nanoseconds to readable date
      const date = new Date(Number(updateDate) * 24 * 60 * 60 * 1000);
      setLastUpdate(date.toLocaleDateString());
    } catch (e) {
      console.error('Error loading poem:', e);
      setCurrentPoem('UNABLE TO LOAD POEM');
      setCurrentTitle('ERROR');
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
          <h1 className="text-2xl md:text-4xl mb-4" style={{fontFamily: 'Press Start 2P, monospace'}}>
            DAILY POETRY
          </h1>
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
              {/* Title and Date Area */}
              <div className="mb-8">
                <h2 className="handwritten-title mb-2">
                  {currentTitle.toUpperCase() || 'LOADING...'}
                </h2>
                <div className="handwritten text-xs text-gray-500 mb-6">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }).toUpperCase()}
                </div>
              </div>

              {/* Poem Content */}
              <div className="flex-1 flex items-start justify-start pt-4">
                <div className="handwritten">
                  {formatPoem(currentPoem.toUpperCase() || 'LOADING POEM...')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8 text-xs text-gray-500" style={{fontFamily: 'Press Start 2P, monospace'}}>
          POWERED BY INTERNET COMPUTER AI
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
