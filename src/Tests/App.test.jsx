jest.mock('axios');

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import axios from 'axios';
import App from './App';

// Mock axios for API calls


describe('App component tests', () => {
  // Test initial render and default state
  it('renders App and shows initial UI elements', () => {
    render(<App />);
    expect(screen.getByText(/TrackTactics/i)).toBeInTheDocument();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument(); // Assuming initial loading state
  });

  // Test API call and data fetching
  it('fetches data and updates the state correctly', async () => {
    // Mock the axios response
    axios.get.mockResolvedValueOnce({
      data: {
        MRData: {
          DriverTable: {
            Drivers: [{ driverId: 'someDriver', givenName: 'John', familyName: 'Doe' }]
          },
          RaceTable: {
            Races: [{
              round: '1',
              Results: [{ position: '5' }]
            }]
          }
        }
      }
    });

    render(<App />);
    // Wait for the async data fetch to complete
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../)).toBeNull();
      expect(screen.getByText(/Score:/i)).toBeInTheDocument();
    });

    // Check if the correct data is rendered
    expect(screen.getByText(/John Doe finished/i)).toBeInTheDocument();
  });

  // Test user interactions
  it('handles user interactions correctly', async () => {
    // Mock the axios response
    axios.get.mockResolvedValueOnce(/* Mocked response as above */);

    render(<App />);
    await waitFor(() => expect(screen.queryByText(/Loading.../)).toBeNull());

    // Simulate user selecting a year
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2020' } });
    expect(screen.getByText(/Loading.../)).toBeInTheDocument();

    // Simulate user making a guess
    // Assuming you have buttons or elements to click for guessing
    fireEvent.click(screen.getByText(/Guess Button Text/));
    await waitFor(() => {
      expect(screen.getByText(/Correct!|Wrong./i)).toBeInTheDocument();
    });
  });

  // Additional tests can be added here to cover other scenarios and edge cases
});