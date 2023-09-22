import React, { useState, useContext, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Alert } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

function Staff({ handleUpdateStaff, staffs, deleteStaff, isLoggedIn, managers, lastSeen, loggedInSeen }) {
  const [show, setShow] = useState(false);
  const { backendUrl } = useContext(OmsContext);
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({
    staff_name: "",
    joining_date: "",
    reporting_to: "",
    email: "",
    designation: "",
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${backendUrl}/staffs`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        const data = response.data;
        handleUpdateStaff(data);
        setFormData({
          staff_name: "",
          joining_date: "",
          reporting_to: "",
          email: "",
          designation: "",
        });
        setServerError("");
        setShowAlert(true);
        handleClose(); // Close the modal immediately upon success
      } else {
        throw new Error(`Network response was not ok. Response status: ${response.status}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorMessages = error.response.data.error;
        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          // Set the server error directly in the state
          setServerError(errorMessages[0]);
        } else {
          setServerError("Email already exists");
        }
      } else {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg ml-15 px-5 pb-8 pt-3">
      <div className="staff-details">
        <div className="row">
          <div className="col-sm-3 mt-5 mb-4 text-gred">
            <div className="search">
              <form className="form-inline">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search Staff"
                  aria-label="Search"
                />
              </form>
            </div>
          </div>
          <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: "green" }}>
            <h3>
              <b>Staff Details</b>
            </h3>
          </div>
          <div className="col-sm-3 offset-sm-1 mt-5 mb-4 text-gred">
            <Button variant="primary" onClick={handleShow}>
              Add New Staff
            </Button>
          </div>
        </div>
        {showAlert && (
          <div className="alert-popup">
            <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
              Staff added successfully!
            </Alert>
          </div>
        )}
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Joining Date</th>
                  <th>Report To</th>
                  <th>Designation</th>
                  {/* <th>Online Status</th>
                  <th>Last Seen</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffs &&
                  Array.isArray(staffs) &&
                  staffs.map((staff) => (
                    <tr key={staff.id}>
                      <td>{staff.staff_name}</td>
                      <td>{staff.joining_date}</td>
                      <td>{staff.reporting_to}</td>
                      <td>{staff.designation}</td>
                      {/* <td className='text-center'><div className='border-solid border-1 bg-blue-500 text-white px-2 py-2 rounded-lg'>{loggedInSeen || staff.online_status}</div></td>
                      <td className='text-center'><div className='border-solid border-1 bg-gray-300 text-white-600 px-2 py-2 rounded-lg'>{lastSeen}</div></td> */}
                      <td>
                        <Button variant="danger" onClick={() => deleteStaff(staff.id)}>
                          Delete
                        </Button>
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
              <Modal.Title>Add New Staff</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="staff_name">Staff Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="staff_name"
                    id="staff_name"
                    placeholder="Enter Staff Name"
                    value={formData.staff_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="joining_date">Joining Date</label>
                  <input
                    type="date"
                    className="datePicker"
                    name="joining_date"
                    id="joining_date"
                    placeholder="Enter Joining Date"
                    value={formData.joining_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="reporting_to">Reporting To</label>
                  <select
                    className="form-control"
                    name="reporting_to"
                    id="reporting_to"
                    value={formData.reporting_to}
                    onChange={handleChange}
                  >
                    <option value="">Select Reporting To</option>
                    {managers &&
                      Array.isArray(managers) &&
                      managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          {manager.f_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {serverError && (
                    <small className="text-danger">{serverError}</small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="designation">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    name="designation"
                    id="designation"
                    placeholder="Enter Designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-success mt-4">
                  Add Staff
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

export default Staff;
