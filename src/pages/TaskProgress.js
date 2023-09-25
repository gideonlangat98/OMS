import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Alert, Form, Row, Col } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

function TaskProgress({ handleUpdateProgress, tasks, useType, loggedInStaff, userType, progresses, managers, deleteProgress }) {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [editProgressId, setEditProgressId] = useState(null);
  const { backendUrl } = useContext(OmsContext);

  const [selectedTask, setSelectedTask] = useState(null);

  const [formData, setFormData] = useState({
    progress_by: loggedInStaff,
    task_managed: '',
    assignment_name: '',
    project_managed: '',
    assigned_date: '',
    start_date: '',
    exceeded_by: 0, // Initialize exceeded_by to 0
    granted_time: '',
    delivery_time: '',
  });

  useEffect(() => {
    if (selectedTask) {
      // Update the form data with the selected task's values
      setFormData((prevData) => ({
        ...prevData,
        assigned_date: selectedTask.assignment_date,
        granted_time: selectedTask.completion_date,
      }));
    }
  }, [selectedTask]);

  // Calculate exceeded days whenever delivery_time or granted_time changes
  useEffect(() => {
    if (formData.delivery_time && formData.granted_time) {
      const deliveryDate = new Date(formData.delivery_time);
      const grantedDate = new Date(formData.granted_time);

      // Calculate the exceeded time in days
      const exceededTime = Math.max(0, (deliveryDate - grantedDate) / (1000 * 60 * 60 * 24));

      setFormData((prevData) => ({
        ...prevData,
        exceeded_by: exceededTime,
      }));
    }
  }, [formData.delivery_time, formData.granted_time]);

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setFormData({
      progress_by: loggedInStaff,
      task_managed: '',
      assignment_name: '',
      project_managed: '',
      assigned_date: '',
      start_date: '',
      exceeded_by: 0, // Reset exceeded_by to 0
      granted_time: '',
      delivery_time: '',
    });
  };

  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (editMode && editProgressId) {
      axios
        .put(`${backendUrl}/progresses/${editProgressId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(function (response) {
          if (response.status === 200) {
            const updatedProgress = response.data;
            handleUpdateProgress(updatedProgress);
            handleClose();
          } else {
            throw new Error(`Network response was not ok. Response status: ${response.status}`);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .post(`${backendUrl}/progresses`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(function (response) {
          if (response.status === 201) {
            const newProgress = response.data;
            handleUpdateProgress(newProgress);
            setShowAlert(true);
            handleClose();
          } else {
            throw new Error(`Network response was not ok. Response status: ${response.status}`);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleEditProgress = (progress) => {
    setEditMode(true);
    setEditProgressId(progress.id);
    setFormData({
      progress_by: progress.progress_by,
      task_managed: progress.task_managed,
      assignment_name: progress.assignment_name,
      project_managed: progress.project_managed,
      assigned_date: progress.assigned_date,
      start_date: progress.start_date,
      exceeded_by: progress.exceeded_by,
      granted_time: progress.granted_time,
      delivery_time: progress.delivery_time,
    });
    handleShow();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'assignment_name') {
      const selectedTask = tasks.find((task) => task.task_name === value);
      setSelectedTask(selectedTask);

      if (formData.delivery_time) {
        const deliveryDate = new Date(formData.delivery_time);
        const grantedDate = new Date(selectedTask.completion_date);

        const exceededTime = Math.max(0, (deliveryDate - grantedDate) / (1000 * 60 * 60 * 24));

        setFormData((prevData) => ({
          ...prevData,
          exceeded_by: exceededTime,
        }));
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg ml-15 px-5 pb-8 pt-3">
      <div className="manager-details">
        <div className="row">
          <div className="col-sm-3 mt-5 mb-4 text-gred">
            <div className="search">
              <form className="form-inline">
                <input className="form-control mr-sm-2" type="search" placeholder="Search progress" aria-label="Search" />
              </form>
            </div>
          </div>
          <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: 'green' }}>
            <h3>
              <b>Progress Details</b>
            </h3>
          </div>
          <div className="col-sm-3 offset-sm-1 mt-5 mb-4 text-gred text-center">
            {useType === 'staff' && (
              <Button variant="primary" onClick={handleShow}>
                Update Progress
              </Button>
            )}
          </div>
        </div>
        {showAlert && (
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
            Progress updated successfully!
          </Alert>
        )}
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Task Name</th>
                  <th>Task Manager</th>
                  <th>Project Manager</th>
                  <th>Assigned Date</th>
                  <th>Start Date</th>
                  <th>Expected Completion Date</th>
                  <th>Delivery Date</th>
                  <th>Exceeded By</th>
                </tr>
              </thead>
              <tbody>
                {progresses &&
                  Array.isArray(progresses) &&
                  progresses.map((progress) => (
                    <tr key={progress.id}>
                      <td>{progress.progress_by}</td>
                      <td>{progress.assignment_name}</td>
                      <td>{progress.task_managed}</td>
                      <td>{progress.project_managed}</td>
                      <td>{progress.assigned_date}</td>
                      <td>{progress.start_date}</td>
                      <td>{progress.granted_time}</td>
                      <td>{progress.delivery_time}</td>
                      <td>{progress.exceeded_by}</td>
                      
                      <td className="text-center">
                        <div className="d-flex justify-content-center">
                          {useType === 'staff' && (
                            <Button variant="info" className="mr-2" onClick={() => handleEditProgress(progress)}>
                              Edit
                            </Button>
                          )}
                          {userType === 'admin' && (
                            <Button variant="danger" onClick={() => deleteProgress(progress.id)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="model_box">
          <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
              <Modal.Title>{editMode ? 'Edit Progress' : 'Update Progress'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col sm={6}>
                    <Form.Group controlId="formProgressBy">
                      <Form.Label className="font-bold">Staff Name</Form.Label>
                      <Form.Control as="select" name="progress_by" value={loggedInStaff} onChange={handleChange}>
                        <option value={loggedInStaff}>{loggedInStaff}</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  
                </Row>
                <Row>
                  <Col sm={6}>
                    <div className="form-group mt-3">
                      <label className="font-bold">Task Name</label>
                      <select className="form-control" name="assignment_name" value={formData.assignment_name} onChange={handleChange}>
                        <option value="">Select Task</option>
                        {tasks &&
                          Array.isArray(tasks) &&
                          tasks.map((task) => (
                            <option key={task.id} value={task.task_name}>
                              {task.task_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <Form.Group controlId="formManaged">
                      <Form.Label className="font-bold">Task Manager</Form.Label>
                      <Form.Control as="select" name="task_managed" value={formData.task_managed} onChange={handleChange}>
                        <option value="">Select Manager</option>
                        {managers &&
                          Array.isArray(managers) &&
                          managers.map((manager) => (
                            <option key={manager.id} value={manager.f_name}>
                              ID: {manager.id} - Name: {manager.f_name} {manager.l_name} - {manager.managers_title}
                            </option>
                          ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group mt-3">
                      <label className="font-bold">Project Manager</label>
                      <Form.Control
                        as="select"
                        name="project_managed"
                        value={formData.project_managed}
                        onChange={handleChange}
                      >
                        <option value="">Select Manager</option>
                        {managers &&
                          Array.isArray(managers) &&
                          managers.map((manager) => (
                            <option key={manager.id} value={manager.f_name}>
                              ID: {manager.id} - Name: {manager.f_name} {manager.l_name} - {manager.managers_title}
                            </option>
                          ))}
                      </Form.Control>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <div className="form-group mt-3">
                      <label className="font-bold">Assigned Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="assigned_date"
                        placeholder="Enter Assigned Date"
                        value={formData.assigned_date}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group mt-3">
                      <label className="font-bold">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="start_date"
                        placeholder="Start Date"
                        value={formData.start_date}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <div className="form-group mt-3">
                      <label className="font-bold">Exceeded By</label>
                      <input
                        type="text"
                        className="form-control"
                        name="exceeded_by"
                        placeholder="Exceeded Time"
                        value={formData.exceeded_by}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="form-group mt-3">
                      <label className="font-bold">Granted Time</label>
                      <input
                        type="text"
                        className="form-control"
                        name="granted_time"
                        placeholder="Granted Time"
                        value={formData.granted_time}
                        onChange={handleChange}
                        readOnly
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6}>
                    <div className="form-group mt-3">
                      <label className="font-bold">Delivery Time</label>
                      <input
                        type="date"
                        className="form-control"
                        name="delivery_time"
                        placeholder="Delivery Time"
                        value={formData.delivery_time}
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Row>
                <div className="text-center">
                  <button type="submit" className="btn btn-success mt-4">
                    {editMode ? 'Update' : 'Update Progress'}
                  </button>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default TaskProgress;
