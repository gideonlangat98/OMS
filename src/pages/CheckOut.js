import React, { useState, useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { OmsContext } from '../components/auth/AuthContext';

function CheckOut({ isCheckedIn, isCheckedOut, setIsCheckedIn, setIsCheckedOut }) {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { backendUrl } = useContext(OmsContext);

  useEffect(() => {
    if (isCheckedOut === null) {
      setError(null); // Clear any previous error messages
    } else if (isCheckedOut) {
      setError({ message: '' });
    }
  }, [isCheckedOut]);

  const handleCheckOut = async () => {
    if (!isCheckedIn) {
      setError({ message: 'You must check in before checking out.' });
    } else if (isCheckedOut) {
      setError({ message: 'You have already checked out.' });
    } else {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Get the timestamp of the last check-in from local storage
        const lastCheckInTimestamp = localStorage.getItem('lastCheckInTimestamp');
        if (lastCheckInTimestamp) {
          const lastCheckInDate = new Date(parseInt(lastCheckInTimestamp, 10));
          const currentDate = new Date();

          // Check if the last check-in was on the same day
          if (lastCheckInDate.toDateString() !== currentDate.toDateString()) {
            setError({ message: 'You have not checked in today.' });
            return;
          }
        }

        await axios.post(`${backendUrl}/check_in_outs/check_out`, null, config);

        const now = new Date();
        const formattedTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        setSuccessMessage(`You have successfully checked out at ${formattedTime}`);
        setIsCheckedOut(true);
        setError(null);
      } catch (error) {
        if (error.response) {
          setError(error.response.data);
          setSuccessMessage('');
        } else if (error.request) {
          setError({ message: 'Network Error' });
          setSuccessMessage('');
        } else {
          setError({ message: 'An error occurred' });
          setSuccessMessage('');
        }
      }
    }
  };

  return (
    <div>
      {error && <div>{error.message}</div>}
      {successMessage && <div>{successMessage}</div>}
      <Button variant='danger' onClick={handleCheckOut} style={{ padding: '1.5rem' }}>
        Check Out
      </Button>
    </div>
  );
}

export default CheckOut;
