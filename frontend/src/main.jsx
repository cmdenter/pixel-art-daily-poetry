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
      <div key={index} className="screen-text">
        {line || ' '} {/* Empty lines show as space to maintain line height */}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl mb-4 text-green-400" style={{fontFamily: 'Press Start 2P, monospace', textShadow: '0 0 10px #00ff00'}}>
            DAILY POETRY TERMINAL
          </h1>
        </div>

        {/* Computer Screen Container */}
        <div className="flex justify-center">
          <div className="computer-screen p-6 min-h-fit max-w-full">
            {/* Screen Header */}
            <div className="screen-title">
              {currentTitle.toUpperCase() || 'LOADING...'}
            </div>
            
            <div className="screen-date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }).toUpperCase()}
            </div>

            {/* Poem Content - Dynamic sizing */}
            <div className="flex flex-col items-start justify-start">
              {formatPoem(currentPoem.toUpperCase() || 'LOADING POEM...')}
            </div>

            {/* Terminal cursor */}
            <div className="screen-text mt-4">
              <span className="animate-pulse">█</span>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-8 text-xs text-green-600" style={{fontFamily: 'Press Start 2P, monospace', textShadow: '0 0 5px #00aa00'}}>
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
