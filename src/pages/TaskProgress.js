import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Alert, Form } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

function TaskProgress({ handleUpdateProgress, useType, loggedInStaff, userType, progresses, managers, deleteProgress }) {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [editProgressId, setEditProgressId] = useState(null);
  const {backendUrl} = useContext(OmsContext);
  const [formData, setFormData] = useState({
    progress_by: loggedInStaff,
    task_managed: '',
    project_managed: '',
    assigned_date: '',
    start_date: '',
    exceeded_by:'',
    delivery_time: '',
  });

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setFormData({
        progress_by: '',
        task_managed: '',
        project_managed: '',
        assigned_date: '',
        start_date: '',
        exceeded_by:'',
        delivery_time: '',
    });
  };

  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

    if (editMode && editProgressId) {
      // Update existing manager
      axios
        .put(`${backendUrl}/progresses/${editProgressId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }, // Include the JWT token in the request headers
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
      // Add new manager
      axios
        .post(`${backendUrl}/progresses`, formData, {
          headers: { Authorization: `Bearer ${token}` }, // Include the JWT token in the request headers
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
        project_managed: progress.project_managed,
        assigned_date:  progress.assigned_date,
        start_date: progress.start_date,
        exceeded_by: progress.exceeded_by,
        delivery_time: progress.delivery_time,
    });
    handleShow();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
          <div className="col-sm-3 offset-sm-1 mt-5 mb-4 text-gred">
            {useType === 'staff' && (
              <Button variant="primary" onClick={handleShow}>
                Update Progress
              </Button>
            )}
          </div>
        </div>
        {showAlert && (
        <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
          Progress updated successfully!
        </Alert>
        )}
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Task Manager</th>
                  <th>Project Manager</th>
                  <th>Assigned Date</th>
                  <th>Start Date</th>
                  <th>Exceeded By</th>
                  <th>Delivery Time</th>
                </tr>
              </thead>
              <tbody>
                {progresses &&
                  Array.isArray(progresses) &&
                  progresses.map((progress) => (
                    <tr key={progress.id}>
                      <td>{progress.progress_by}</td>
                      <td>{progress.task_managed}</td>
                      <td>{progress.project_managed}</td>
                      <td>{progress.assigned_date}</td>
                      <td>{progress.start_date}</td>
                      <td>{progress.exceeded_by}</td>
                      <td>{progress.delivery_time}</td>
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
              <Modal.Title>{editMode ? 'Edit Progress' : 'Update Progres'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
              <div>
              <Form.Group controlId='formProgressBy'>
                <Form.Label>Staff Name</Form.Label>
                <Form.Control as='select' name='progress_by' value={loggedInStaff} onChange={handleChange}>
                  <option value={loggedInStaff}>
                    {loggedInStaff}
                  </option>
                </Form.Control>
              </Form.Group>
                <Form.Group controlId="formManaged">
                  <Form.Label className="font-bold">Task Manager</Form.Label>
                  <Form.Control as="select" name="task_managed" value={formData.task_managed} onChange={handleChange}>
                    <option value="">Select Manager</option>
                    {managers &&
                      Array.isArray(managers) &&
                      managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          ID: {manager.id} - Name: {manager.f_name} {manager.l_name} - {manager.title}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div>
                <Form.Group controlId="formManaged">
                  <Form.Label className="font-bold">Project Manager</Form.Label>
                  <Form.Control as="select" name="project_managed" value={formData.project_managed} onChange={handleChange}>
                    <option value="">Select Manager</option>
                    {managers &&
                      Array.isArray(managers) &&
                      managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          ID: {manager.id} - Name: {manager.f_name} {manager.l_name} - {manager.title}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </div>
                <div className="form-group mt-3">
                  <label className="font-bold">Assigned Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="assigned_date"
                    placeholder="Enter Assigned Date"
                    value={formData.assigned_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mt-3">
                  <label className="font-bold">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="start_date"
                    placeholder="Enter Start Date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <label className='font-bold'>Exceeded By</label>
                  <input
                    type="text"
                    className="form-control"
                    name="exceeded_by"
                    placeholder="Exceeded Time"
                    value={formData.exceeded_by}
                    onChange={handleChange}
                  />
                </div>

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

                  <button type="submit" className="btn btn-success mt-4">
                   {editMode ? 'Update' : 'Update Progress'}
                </button>
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
