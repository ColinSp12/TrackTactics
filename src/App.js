import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from './Components/StatCard';
import './App.css';

const App = () => {
  const [currentStat, setCurrentStat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userFeedback, setUserFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDriverAndStat();
  }, [selectedYear]);

  const formatOrdinal = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return num + "st";
    }
    if (j === 2 && k !== 12) {
      return num + "nd";
    }
    if (j === 3 && k !== 13) {
      return num + "rd";
    }
    return num + "th";
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setUserFeedback('');
    setCurrentStat(null);
    setScore(0);
    fetchDriverAndStat();
  };

  const fetchDriverAndStat = async () => {
    setIsLoading(true);
    try {
      const driversResponse = await axios.get(`http://ergast.com/api/f1/${selectedYear}/drivers.json`);
      const drivers = driversResponse.data.MRData.DriverTable.Drivers;
      if (drivers.length === 0) {
        throw new Error(`No drivers found for the year ${selectedYear}`);
      }
      const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];

      const resultsResponse = await axios.get(`http://ergast.com/api/f1/${selectedYear}/drivers/${randomDriver.driverId}/results.json`);
      const results = resultsResponse.data.MRData.RaceTable.Races;
      if (results.length === 0) {
        throw new Error(`No race results found for the driver in ${selectedYear}`);
      }
      const randomRace = results[Math.floor(Math.random() * results.length)];
      const actualPosition = parseInt(randomRace.Results[0].position, 10);

      let presentedPosition = actualPosition;
      while (presentedPosition === actualPosition) {
        presentedPosition = Math.floor(Math.random() * (results.length)) + 1;
      }

      setCurrentStat({
        question: `${randomDriver.givenName} ${randomDriver.familyName} finished ${formatOrdinal(presentedPosition)} in round ${randomRace.round} of the ${selectedYear} season.`,
        isHigher: actualPosition < presentedPosition,
        actualPosition: formatOrdinal(actualPosition),
        round: randomRace.round
      });
      setUserFeedback('');
    } catch (error) {
      console.error('Error fetching data: ', error);
      setUserFeedback('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuess = (guess) => {
    const isCorrect = (guess === 'higher' && currentStat.isHigher) || (guess === 'lower' && !currentStat.isHigher);
    if (isCorrect) {
      setScore(score + 1);
      setUserFeedback('Correct!');
    } else {
      setScore(0);
      setUserFeedback(`Wrong. Actual finishing position was: ${currentStat.actualPosition}`);
    }
    setTimeout(fetchDriverAndStat, 2000);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="score-board">
        Score: <span className="score-value">{score}</span>
      </div>
      <div className="container">
        <h1 className="title">TrackTactics</h1>
        <div className="year-selector">
          <label>
            Select Year: 
            <select 
              className="year-dropdown"
              value={selectedYear} 
              onChange={handleYearChange}
            >
              {Array.from({ length: new Date().getFullYear() - 1950 + 1 }, (_, i) => 1950 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
        </div>
        {currentStat && (
          <div className="stat-card-container">
            <StatCard stat={currentStat} onGuess={handleGuess} />
          </div>
        )}
        <div className="feedback">{userFeedback}</div>
      </div>
    </div>
  );
};

export default App;
