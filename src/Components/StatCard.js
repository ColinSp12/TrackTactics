import React from 'react';

const StatCard = ({ stat, onGuess }) => {
  // Example buttons with images and borders
  return (
    <div className="stat-card p-4 rounded-lg shadow-lg bg-white">
      <p className="text-lg mb-4">{stat.question}</p>
      <div className="flex justify-around">
        <button 
          className="bg-blue-500 bg-cover bg-center border border-blue-700 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline" 
          style={{ backgroundImage: 'url(path-to-your-image.jpg)' }}
          onClick={() => onGuess('higher')}
        >
          Higher
        </button>
        <button 
          className="bg-red-500 bg-cover bg-center border border-red-700 text-white font-bold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
          style={{ backgroundImage: 'url(path-to-another-image.jpg)' }}
          onClick={() => onGuess('lower')}
        >
          Lower
        </button>
      </div>
    </div>
  );
};

export default StatCard;