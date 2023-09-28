import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Alert, Form } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

function Request({ handleUpdateRequest, updateRequest, requests, tasks, loggedInStaff, managers, dashboardType, useType, userType, deleteRequest }) {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [editRequestId, setEditRequestId] = useState(null);
  const {backendUrl} = useContext(OmsContext);
  const [formData, setFormData] = useState({
    request_by: loggedInStaff,
    task_request: '',
    request_detail: '',
    request_date: '',
    request_to: '',
  });

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setFormData({
        request_by: '',
        task_request: '',
        request_detail: '',
        request_date: '',
        request_to: '',
    });
  };

  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

    if (editMode && editRequestId) {
      // Update existing manager
      axios
        .put(`${backendUrl}/requests/${editRequestId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }, // Include the JWT token in the request headers
        })
        .then(function (response) {
          if (response.status === 200) {
            const updatedRequest = response.data;
            updateRequest(updatedRequest);
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
        .post(`${backendUrl}/requests`, formData, {
          headers: { Authorization: `Bearer ${token}` }, // Include the JWT token in the request headers
        })
        .then(function (response) {
          if (response.status === 201) {
            const newRequest = response.data;
            handleUpdateRequest(newRequest);
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

  const handleEditRequest = (request) => {
    setEditMode(true);
    setEditRequestId(request.id);
    setFormData({
        request_by: request.request_by,
        request_task: request.task_request,
        request_detail: request.request_detail,
        request_date: request.request_date,
        request_to:  request.request_to,
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
                <input className="form-control mr-sm-2" type="search" placeholder="Search Request" aria-label="Search" />
              </form>
            </div>
          </div>
          <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: 'green' }}>
            <h3>
              <b>Special Request</b>
            </h3>
          </div>
          
          {useType === 'staff' && (
            <div className="col-sm-3 offset-sm-1 mt-5 mb-4 text-gred">
              <Button variant="primary" onClick={handleShow}>
                Apply Special Request
              </Button>
          </div>
          )}
        </div>
        {showAlert && (
        <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
          Request updated successfully!
        </Alert>
        )}
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Task Name</th>
                  <th>Request Detail</th>
                  <th>Request Date</th>
                  <th>Request To</th>
                </tr>
              </thead>
              <tbody>
                {requests &&
                  Array.isArray(requests) &&
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.request_by}</td>
                      <td>{request.task_request}</td>
                      <td>{request.request_detail}</td>
                      <td>{request.request_date}</td>
                      <td>{request.request_to}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center">
                        
                           {useType === 'staff' && (
                            <Button variant="info" className="mr-2" onClick={() => handleEditRequest(request)}>
                             Edit
                           </Button>
                           )}
                           {userType === 'admin' && (
                            <Button variant="danger" onClick={() => deleteRequest(request.id)}>
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
              <Modal.Title>{editMode ? 'Edit Request' : 'Apply Special Request'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div>
                <Form.Group controlId='formRequestBy'>
                 <Form.Label className='font-bold'>Staff Name</Form.Label>
                 <Form.Control as='select' name='request_by' value={loggedInStaff} onChange={handleChange}>
                    <option value={loggedInStaff}>
                     {loggedInStaff}
                    </option>
                 </Form.Control>
                </Form.Group>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="task_request" className="font-bold">
                    Task Name
                  </label>
                  <select 
                    className="form-control"
                    name="task_request"
                    id="task_request"
                    value={formData.task_request}
                    onChange={handleChange}
                  >
                   <option value="">Task Name</option>
                    {tasks && Array.isArray(tasks) && tasks.filter((task) => task.assigned_to === loggedInStaff).map((task) => (
                    <option key={task.id} value={task.task_name}>
                      {task.task_name}
                    </option>
                    ))}
                    </select>
                </div>

                <div className="form-group mt-3">
                  <label className="font-bold">Request Detail</label>
                  <input
                    type="text"
                    className="form-control"
                    name="request_detail"
                    placeholder="Enter Request Detail"
                    value={formData.request_detail}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <label className="font-bold">Request Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="request_date"
                    placeholder="Enter Request Date"
                    value={formData.request_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="request_to" className="font-bold">Request To</label>
                  <select
                    className="form-control"
                    name="request_to"
                    id="request_to"
                    value={formData.request_to}
                    onChange={handleChange}
                  >
                    <option value="">Request To</option>
                    {managers &&
                      Array.isArray(managers) &&
                      managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          {manager.f_name} {manager.l_name} - {manager.managers_title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-success mt-4">
                    {editMode ? 'Update Request' : 'Apply Special Request'}
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

export default Request;
