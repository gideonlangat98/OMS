import React, { useState, useEffect, useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { OmsContext } from './auth/AuthContext';

const Navbar = ({ userType, useType, setIsCheckedIn, setIsCheckedOut, loggedInStaff, setLoggedInManager, setLoggedInStaff, updateLoggedIn, loggedInManager }) => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(OmsContext);

  // State to hold the current date and time
  const [currentDateTime, setCurrentDateTime] = useState(null);

  // Function to format a date object as a string
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    // Update current date and time when the component mounts
    setCurrentDateTime(formatDate(new Date()));
    
    // Retrieve loggedInStaff and loggedInManager from localStorage
    const storedLoggedInStaff = localStorage.getItem('loggedInStaff');
    const storedLoggedInManager = localStorage.getItem('loggedInManager');

    // Set loggedInStaff and loggedInManager in state if they exist in localStorage
    if (storedLoggedInStaff) {
      updateLoggedIn(true);
    }

    if (storedLoggedInStaff) {
      setLoggedInStaff(storedLoggedInStaff);
    }

    if (storedLoggedInManager) {
      setLoggedInManager(storedLoggedInManager);
    }
  }, [updateLoggedIn]);

  const welcomeText = 'Welcome To Admin Dashboard';
  const staffText = `Welcome back, ${loggedInStaff}`;
  const managerText = `Welcome back, ${loggedInManager}`;

  function handleLogout() {
    fetch(`${backendUrl}/logout`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          // Clear user data from local storage
          localStorage.removeItem('user');
          localStorage.removeItem('loggedInStaff');
          localStorage.removeItem('loggedInManager');

          // Update logged-in state
          updateLoggedIn(false);
          setIsCheckedIn(null); // Reset to null when the user logs out
          setIsCheckedOut(null); // Reset to null when the user logs out
         

          // Navigate to the desired page
          navigate('/');
        } else {
          // Handle error response
          throw new Error('Logout failed');
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  }

  return (
    <nav className="bg-white border-gray-200 mx-2 px-2 py-2.5 rounded dark:bg-gray-800">
      <div className="container flex justify-between items-center mx-auto pt-3">
        <div className="flex flex-col items-center">
          <span style={{ marginLeft: '30rem' }} className="text-xl font-medium whitespace-nowrap dark:text-white">
            {userType === 'admin' ? welcomeText : (useType ? staffText : managerText)}
          </span>

          {currentDateTime && (
            <span style={{marginLeft: "30rem"}} className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              Logged in on {currentDateTime}
            </span>
          )}
        </div>
        <div>
          <FaUser
            style={{marginRight: "18rem"}}
            className="text-4xl cursor-pointer text-blue-500 hover:text-blue-600"
            onClick={() => navigate('/stdashboard/profile')}
          />
        </div>
        <div>
          <div>
            <button
              className="text-xl text-white bg-red-500 hover:bg-red-600 py-2 px-10 mt-2 mr-8 rounded-full"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
