import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Alert } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

function Managers({ handleUpdateManager, managers, deleteManagers, updateManager }) {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [editManagerId, setEditManagerId] = useState(null);
  const {backendUrl} = useContext(OmsContext);
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    managers_title: '',
    email: '',
  });

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setFormData({
      f_name: '',
      l_name: '',
      managers_title: '',
      email: '',
    });
  };

  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

    if (editMode && editManagerId) {
      // Update existing manager
      axios
        .put(`${backendUrl}/managers/${editManagerId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }, // Include the JWT token in the request headers
        })
        .then(function (response) {
          if (response.status === 201) {
            const updatedManager = response.data;
            updateManager(updatedManager);
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
        .post(`${backendUrl}/managers`, formData, {
          headers: { Authorization: `Bearer ${token}` }, // Include the JWT token in the request headers
        })
        .then(function (response) {
          if (response.status === 201) {
            const newManager = response.data;
            handleUpdateManager(newManager);
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

  const handleEditManager = (manager) => {
    setEditMode(true);
    setEditManagerId(manager.id);
    setFormData({
      f_name: manager.f_name,
      l_name: manager.l_name,
      managers_title: manager.managers_title,
      email: manager.email,
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
                <input className="form-control mr-sm-2" type="search" placeholder="Search manager" aria-label="Search" />
              </form>
            </div>
          </div>
          <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: 'green' }}>
            <h3>
              <b>Managers Details</b>
            </h3>
          </div>
          <div className="col-sm-3 offset-sm-1 mt-5 mb-4 text-gred">
            <Button variant="primary" onClick={handleShow}>
              Add New Manager
            </Button>
          </div>
        </div>
        {showAlert && (
        <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
          Manager added successfully!
        </Alert>
        )}
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {managers &&
                  Array.isArray(managers) &&
                  managers.map((manager) => (
                    <tr key={manager.id}>
                      <td>
                        {manager.f_name} {manager.l_name}
                      </td>
                      <td>{manager.managers_title}</td>
                      <td>{manager.email}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center">
                          <Button variant="info" className="mr-2" onClick={() => handleEditManager(manager)}>
                            Edit
                          </Button>
                          <Button variant="danger" onClick={() => deleteManagers(manager.id)}>
                            Delete
                          </Button>
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
              <Modal.Title>{editMode ? 'Edit Manager' : 'Add Manager'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="f_name"
                    placeholder="Enter First Name"
                    value={formData.f_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="l_name"
                    placeholder="Enter Last Name"
                    value={formData.l_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="managers_title"
                    placeholder="Enter Title"
                    value={formData.managers_title}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-success mt-4">
                  {editMode ? 'Update Manager' : 'Add Manager'}
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

export default Managers;