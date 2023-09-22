import React, { useState, useContext, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

const Timesheets = () => {
  const { backendUrl } = useContext(OmsContext);
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    // Fetch timesheets data when the component mounts
    fetchTimesheets();
  }, []);

  // Function to fetch timesheets data
  const fetchTimesheets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/timesheets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimesheets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to combine start and end timesheets with the same date
  const combineTimesheets = (timesheets) => {
    const combinedTimesheets = [];
    timesheets.forEach((timesheet) => {
      const existingTimesheet = combinedTimesheets.find(
        (item) => item.date === timesheet.date && item.staff_id === timesheet.staff_id
      );
      if (existingTimesheet) {
        existingTimesheet.end_time = timesheet.end_time;
        existingTimesheet.progress_details = timesheet.progress_details;
      } else {
        combinedTimesheets.push({ ...timesheet });
      }
    });
    return combinedTimesheets;
  };

  // Combine timesheets data
  const combinedTimesheets = combineTimesheets(timesheets);

  // Function to handle delete button click
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/timesheets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Fetch timesheets data after successful deletion
      fetchTimesheets();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className='mx-auto bg-white rounded-lg shadow-lg ml-15 px-3 py-8 pt-3'>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3 className='text-green text-center'>All Timesheets</h3>
          </div>
        </div>

        {/* Table to display combined timesheet entries */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Task to do</th>
              <th>Progress Details</th>
              <th>Time Limit for the Task</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {combinedTimesheets.map((timesheet) => (
              <tr key={timesheet.id}>
                <td>{timesheet.date}</td>
                <td>{timesheet.start_time ? new Date(timesheet.start_time).toLocaleTimeString('en-US', { timeStyle: 'short' }) : '-'}</td>
                <td>{timesheet.end_time ? new Date(timesheet.end_time).toLocaleTimeString('en-US', { timeStyle: 'short' }) : '-'}</td>
                <td>{timesheet.task_detail}</td>
                <td>{timesheet.progress_details || '-'}</td>
                <td>{timesheet.time_limit}</td>
                <td>
                  <Button
                    onClick={() => handleDelete(timesheet.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Timesheets;
