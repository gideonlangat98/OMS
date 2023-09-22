import React, { useState, useContext, useEffect } from 'react';
import { Table, Modal, Button, Form, Alert } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

const StartTimesheet = ({ onUpdateSheet, timesheets, updateSheet, deleteData, tasks, staffId }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const { backendUrl } = useContext(OmsContext);
  const [mode, setMode] = useState('start');

  // Separate state for start timesheet form data
  const [startFormData, setStartFormData] = useState({
    date: '',
    start_time: '',
    task_detail: '',
    time_limit: '',
    staff_id: staffId,
  });

  // Separate state for end timesheet form data
  const [endFormData, setEndFormData] = useState({
    date: '',
    end_time: '',
    task_detail: '',
    progress_details: '',
    staff_id: staffId,
  });

  useEffect(() => {
    setStartFormData((prevStartFormData) => ({ ...prevStartFormData, staff_id: staffId }));
    setEndFormData((prevEndFormData) => ({ ...prevEndFormData, staff_id: staffId }));
  }, [staffId]);

  // Function to filter timesheets based on their status (start or end)
  const filterTimesheets = (status) => {
    return timesheets.filter((timesheet) => {
      if (status === 'start') {
        return !timesheet.end_time;
      } else {
        return timesheet.end_time;
      }
    });
  };

  // Get filtered timesheets based on mode
  const filteredTimesheets = mode === 'start' ? filterTimesheets('start') : filterTimesheets('end');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedDate = new Date(startFormData.date);
      const currentDate = new Date(new Date().setDate(new Date().getDate() - 1));
      if (selectedDate < currentDate) {
        setError('You cannot add a date that is in the past.');
        return;
      }
  
      const token = localStorage.getItem('token');
      let formData;
      if (mode === 'start') {
        formData = startFormData;
      } else {
        formData = endFormData;
      }
  
      const response = await axios.post(
        `${backendUrl}/timesheets`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = response.data;
      onUpdateSheet(data);
      setError('');
  
      if (mode === 'start') {
        setStartFormData({
          date: '',
          start_time: '',
          task_detail: '',
          time_limit: '',
          staff_id: staffId,
        });
      } else {
        setEndFormData({
          date: '',
          end_time: '',
          task_detail: '',
          progress_details: '',
          staff_id: staffId,
        });
      }
  
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setError(selectedDate < new Date(new Date().setDate(new Date().getDate() - 1)) ? 'You cannot select a date that is in the past.' : '');

    if (mode === 'start') {
      setStartFormData({ ...startFormData, [e.target.name]: e.target.value });
    } else {
      setEndFormData({ ...endFormData, [e.target.name]: e.target.value });
    }
  };

  const handleModeSwitch = (mode) => {
    setMode(mode);
    setShowModal(false); // Close the modal when switching modes
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Button variant='info' onClick={() => handleModeSwitch('start')}>
         Task Start Timesheet
        </Button>
        <Button variant='info' onClick={() => handleModeSwitch('end')}>
         Task End Timesheet
        </Button>
      </div>
      
      {mode === 'start' ? (
        <div className='mx-auto bg-white rounded-lg shadow-lg ml-15 px-3 py-8 pt-3'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 className='text-green text-center'>Start Timesheets</h3>
            </div>
            <div>
              <Button variant='primary' onClick={() => setShowModal(true)} style={{ marginTop: '10px' }}>
                Add Start Entry
              </Button>
            </div>
          </div>

          {/* Modal for adding timesheet entry */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Start Timesheet Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId='formDate'>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type='date'
                    name='date'
                    value={startFormData.date}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='formStartTime'>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type='time'
                    name='start_time'
                    value={startFormData.start_time}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='formTask'>
                  <Form.Label>Task</Form.Label>
                  <Form.Control
                    as='select'
                    name='task_detail'
                    value={startFormData.task_detail}
                    onChange={handleChange}
                  >
                    <option value="">Select Task</option>
                    {tasks && Array.isArray(tasks) && tasks.map((task) => (
                      <option key={task.id} value={task.task_name}>
                        ID: {task.id} {task.task_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId='formTaskDeadline'>
                  <Form.Label>Time Limit</Form.Label>
                  <Form.Control
                    as='select'
                    name='time_limit'
                    value={startFormData.time_limit}
                    onChange={handleChange}
                  >
                    <option value="">Time Limit</option>
                    {tasks && Array.isArray(tasks) && tasks.map((task) => (
                      <option key={task.id} value={task.task_deadline}>
                        {task.task_deadline}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button variant='primary' type='submit' style={{ marginTop: '9px' }}>
                  Add Start Entry
                </Button>
              </Form>
              {error && (
                <Alert variant='danger' className='mt-4'>
                  {error}
                </Alert>
              )}
            </Modal.Body>
          </Modal>

          {/* Table to display start timesheet entries */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>Task to do</th>
                <th>Time Limit for the Task</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {filteredTimesheets.map((timesheet) => (
              <tr key={timesheet.id}>
                  <td>{timesheet.date}</td>
                  <td>{new Date(timesheet.start_time).toLocaleTimeString('en-US', { timeStyle: 'short' })}</td>
                  <td>{timesheet.task_detail}</td>
                  <td>{timesheet.time_limit}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className='mx-auto bg-white rounded-lg shadow-lg ml-15 px-3 py-8 pt-3'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 className='text-green text-center'>End Timesheets</h3>
            </div>
            <div>
              <Button variant='primary' onClick={() => setShowModal(true)} style={{ marginTop: '10px' }}>
                Add End Entry
              </Button>
            </div>
          </div>

          {/* Modal for adding end timesheet entry */}
          <Modal show={showModal && mode === 'end'} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add End Timesheet Entry</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId='formDate'>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type='date'
                    name='date'
                    value={endFormData.date}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='formEndTime'>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type='time'
                    name='end_time'
                    value={endFormData.end_time}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='formTask'>
                  <Form.Label>Task</Form.Label>
                  <Form.Control
                    as='select'
                    name='task_detail'
                    value={endFormData.task_detail}
                    onChange={handleChange}
                  >
                    <option value="">Select Task</option>
                    {tasks && Array.isArray(tasks) && tasks.map((task) => (
                      <option key={task.id} value={task.task_name}>
                        ID: {task.id} {task.task_name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="Progress Details">
                  <Form.Label>Enter Progress Details</Form.Label>
                  <Form.Control
                    name='progress_details'
                    value={endFormData.progress_details}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant='primary' type='submit' style={{ marginTop: '9px' }}>
                  Add End Entry
                </Button>
              </Form>
              {error && (
                <Alert variant='danger' className='mt-4'>
                  {error}
                </Alert>
              )}
            </Modal.Body>
          </Modal>

          {/* Table to display end timesheet entries */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>End Time</th>
                <th>Task to do</th>
                <th>Progress Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {filteredTimesheets.map((timesheet) => (
                <tr key={timesheet.id}>
                  <td>{timesheet.date}</td>
                  <td>{new Date(timesheet.end_time).toLocaleTimeString('en-US', { timeStyle: 'short' })}</td>
                  <td>{timesheet.task_detail}</td>
                  <td>{timesheet.progress_details}</td>
                  <td>
                  <td>
                    <Button variant='info'>Edit</Button>
                  </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default StartTimesheet;