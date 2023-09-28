import React, { useState, useContext, useEffect } from 'react';
import { Table, Modal, Button, Form, Alert } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

const StartTimesheet = ({ onUpdateSheet, managers, timesheets, updateSheet, deleteData, tasks, staffId }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const { backendUrl } = useContext(OmsContext);
  const [mode, setMode] = useState('start');

  useEffect(() => {
    // Create a timer to update the end_time every minute
    const timerId = setInterval(() => {
      setEndFormData((prevEndFormData) => ({
        ...prevEndFormData,
        end_time: getCurrentTime(),
      }));
    }, 60000); // 60000 milliseconds = 1 minute

    // Clear the timer when the component unmounts
    return () => clearInterval(timerId);
  }, []); // Run the effect only once when the component mounts

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Separate state for start timesheet form data
  const [startFormData, setStartFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Set default date to current date
    start_time: getCurrentTime(),
    task_detail: '',
    addressed_issue: '',
    task_stuffs: '',
    sorted_by: '',
    time_limit: '',
    staff_id: staffId,
  });

  // Separate state for end timesheet form data
  const [endFormData, setEndFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Set default date to current date
    end_time: getCurrentTime(),
    task_detail: '',
    progress_details: '',
    issues_sorted: '',
    sorted_by: '',
    issues_discussed: '',
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
          date: new Date().toISOString().split('T')[0], // Reset date to current date
          start_time: new Date().toLocaleTimeString('en-US', { timeStyle: 'short' }), // Reset time to current time
          task_detail: '',
          task_stuffs: '',
          addressed_issue: '',
          sorted_by: '',
          time_limit: '',
          staff_id: staffId,
        });
        setShowModal(false); // Close the modal after submitting
      } else {
        setEndFormData({
          date: new Date().toISOString().split('T')[0], // Reset date to current date
          end_time: new Date().toLocaleTimeString('en-US', { timeStyle: 'short' }), // Reset time to current time
          task_detail: '',
          progress_details: '',
          issues_sorted: '',
          sorted_by: '',
          issues_discussed: '',
          staff_id: staffId,
        });
        setShowModal(false); // Close the modal after submitting
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

const handleChange = (e) => {
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
            <div className='mb-2'>
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
                  <Form.Label className='font-bold'>Date</Form.Label>
                  <Form.Control
                    type='date'
                    name='date'
                    value={startFormData.date}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='formStartTime'>
                  <Form.Label className='font-bold mt-4'>Start Time</Form.Label>
                  <Form.Control
                    type='time'
                    name='start_time'
                    value={startFormData.start_time}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='formTask'>
                  <Form.Label className='font-bold mt-4'>Task</Form.Label>
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
                  <Form.Label className='font-bold mt-4'>Select Time Limit</Form.Label>
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

                <Form.Group controlId='formAddressedIssue'>
                  <Form.Label className='font-bold mt-4'>Request Title</Form.Label>
                  <Form.Control
                    as='select'
                    name='addressed_issue'
                    value={startFormData.addressed_issue}
                    onChange={handleChange}
                  >
                    <option value="">Select Request to be Addressed</option>
                    <option value="Clarification">Clarification</option>
                    <option value="Training">Training</option>
                    <option value="Meeting">Meeting</option>
                  </Form.Control>
                </Form.Group>

                  {startFormData.addressed_issue && (
                  <Form.Group controlId='formSortedBy'>
                    <Form.Label className='font-bold mt-4'>Request To</Form.Label>
                    <Form.Control
                      as='select'
                      name='sorted_by'
                      value={startFormData.sorted_by}
                      onChange={handleChange}
                    >
                      <option value="">Select Managers</option>
                      {managers && Array.isArray(managers) && managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          {manager.f_name} {manager.l_name} - {manager.managers_title}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}

                {/* Conditional display for task_stuffs */}
                {startFormData.addressed_issue && (
                  <Form.Group controlId='taskStuffs'>
                    <Form.Label className='font-bold mt-4'>Describe your Request.</Form.Label>
                    <Form.Control
                      type='task_stuffs'
                      name='task_stuffs'
                      value={startFormData.task_stuffs}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}
              
                <div className='text-center mt-4 pb-6'>
                  <Button variant='primary' type='submit' style={{ marginTop: '9px' }}>
                    Add Start Entry
                  </Button>
                </div>
              </Form>
              {error && (
                <Alert variant='danger' className='mt-4'>
                  {error}
                </Alert>
              )}
            </Modal.Body>
          </Modal>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Start Time</th>
                <th>Task to do</th>
                <th>Time Limit for the Task</th>
                <th>Important Issue</th>
                <th>Description</th>
                <th>Request To</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimesheets.map((timesheet) => (
                <tr key={timesheet.id}>
                  <td>{timesheet.date}</td>
                  <td>{new Date(timesheet.start_time).toLocaleTimeString('en-US', { timeStyle: 'short' })}</td>
                  <td>{timesheet.task_detail}</td>
                  <td>{timesheet.time_limit}</td>
                  <td>{timesheet.addressed_issue}</td>
                  <td>{timesheet.task_stuffs}</td>
                  <td>{timesheet.sorted_by}</td>
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
            <div className='mb-2'>
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
                  <Form.Label className='font-bold'>Date</Form.Label>
                  <Form.Control
                    type='date'
                    name='date'
                    value={endFormData.date}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='formEndTime'>
                  <Form.Label className='font-bold mt-4'>End Time</Form.Label>
                  <Form.Control
                    type='time'
                    name='end_time'
                    value={endFormData.end_time}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId='formTask'>
                  <Form.Label className='font-bold mt-4'>Task</Form.Label>
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
                  <Form.Label className='font-bold mt-4'>Enter Progress Details</Form.Label>
                  <Form.Control
                    name='progress_details'
                    value={endFormData.progress_details}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group controlId='formAddressedIssue'>
                  <Form.Label className='font-bold mt-4'>Sorted Issues</Form.Label>
                  <Form.Control
                    as='select'
                    name='issues_sorted'
                    value={endFormData.issues_sorted}
                    onChange={handleChange}
                  >
                    <option value="">Select an Issue Sorted</option>
                    <option value="Clarified By">Clarified By</option>
                    <option value="Trained By">Trained By</option>
                    <option value="Meeting">Meeting</option>
                  </Form.Control>
                </Form.Group>

                 {endFormData.issues_sorted && (
                  <Form.Group controlId='formSortedBy'>
                    <Form.Label className='font-bold mt-4'>Sorted By</Form.Label>
                    <Form.Control
                      as='select'
                      name='sorted_by'
                      value={endFormData.sorted_by}
                      onChange={handleChange}
                    >
                      <option value="">Select Managers</option>
                      {managers && Array.isArray(managers) && managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          {manager.f_name} {manager.l_name} - {manager.managers_title}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                )}

                {/* Conditional display for assisted_by */}
                {endFormData.issues_sorted && (
                  <Form.Group controlId='taskDiscussedIssues'>
                    <Form.Label className='font-bold mt-4'>Describe below</Form.Label>
                    <Form.Control
                      type='issues_discussed'
                      name='issues_discussed'
                      value={endFormData.issues_discussed}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}

              <div className='text-center mt-4 pb-6'>
                <Button variant='primary' type='submit' style={{ marginTop: '9px' }}>
                  Add End Entry
                </Button>
              </div>
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
                <th>Urgent Issues Sorted</th>
                <th>Decription</th>
                <th>Sorted By</th>
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
                  <td>{timesheet.issues_sorted}</td>
                  <td>{timesheet.issues_discussed}</td>
                  <td>{timesheet.sorted_by}</td>
                  <td>
                    <Button variant='info'>Edit</Button>
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