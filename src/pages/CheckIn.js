import React, { useState, useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { OmsContext } from '../components/auth/AuthContext';

function CheckIn({ isCheckedIn, isCheckedOut, setIsCheckedIn, setIsCheckedOut }) {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { backendUrl } = useContext(OmsContext);

  useEffect(() => {
    if (isCheckedIn === null) {
      setError(null); // Clear any previous error messages
    } else if (isCheckedIn) {
      setError({ message: 'You have already checked in.' });
    }
  }, [isCheckedIn]);

  const handleCheckIn = async () => {
    setError(null); // Clear any previous error messages

    if (isCheckedIn) {
      // Check if the last check-in timestamp is for today
      const lastCheckInTimestamp = localStorage.getItem('lastCheckInTimestamp');
      if (lastCheckInTimestamp) {
        const lastCheckInDate = new Date(parseInt(lastCheckInTimestamp, 10));
        const today = new Date();

        if (
          lastCheckInDate.getDate() === today.getDate() &&
          lastCheckInDate.getMonth() === today.getMonth() &&
          lastCheckInDate.getFullYear() === today.getFullYear()
        ) {
          setError({ message: 'You have already checked in today.' });
          return;
        }
      }
    } else if (isCheckedOut) {
      setError({ message: 'You must check out before checking in again.' });
    } else {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        await axios.post(`${backendUrl}/check_in_outs/check_in`, null, config);

        const now = new Date();
        const formattedTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        setSuccessMessage(`You have successfully checked in at ${formattedTime}`);
        setIsCheckedIn(true);

        // Store the current check-in timestamp in localStorage
        localStorage.setItem('lastCheckInTimestamp', now.getTime().toString()); // Store as milliseconds
      } catch (error) {
        console.log('Error from server:', error.response); // Add this line for debugging
        if (error.response && error.response.data) {
          setError({ message: error.response.data.error });
        } else if (error.request) {
          setError({ message: 'Network Error' });
        } else {
          setError({ message: 'An error occurred' });
        }
      }
    }
  };

  return (
    <div>
      {error && <div>Error: {error.message}</div>}
      {successMessage && <div>{successMessage}</div>}
      <Button variant='primary' onClick={handleCheckIn} style={{ padding: '1.5rem' }}>
        Check In
      </Button>
    </div>
  );
}

export default CheckIn;
