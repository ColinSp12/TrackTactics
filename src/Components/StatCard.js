import React from 'react';

const StatCard = ({ stat, onGuess }) => {
  return (
    <div>
      <h2>{stat.question}</h2>
      <button onClick={() => onGuess('higher')}>Higher</button>
      <button onClick={() => onGuess('lower')}>Lower</button>
    </div>
  );
};

export default StatCard;
