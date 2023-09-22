import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Table, Alert } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';

const LeaveType = ({ leave_types, onUpdateLeave, deleteLeave, updateLeave }) => {
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAddLeaveType, setShowAddLeaveType] = useState(false);
  const handleClose = () => {
    setShow(false);
    setShowAddLeaveType(false);
  };
  const handleShow = () => setShow(true);
  const [editingLeave, setEditingLeave] = useState(null);
  const { backendUrl } = useContext(OmsContext);

  const [formData, setFormData] = useState({
    leave_reason: '',
    days_allowed: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const url = editingLeave
      ? `${backendUrl}/leave_types/${editingLeave.id}`
      : `${backendUrl}/leave_types`;

    const method = editingLeave ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(function (response) {
        if (response.status === 201 || response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Network response was not ok. Response status: ${response.status}`);
        }
      })
      .then(function (data) {
        if (editingLeave) {
          updateLeave(data);
          setEditingLeave(null);
        } else {
          onUpdateLeave(data);
        }

        setShowAlert(true);

        setFormData({
          leave_reason: '',
          days_allowed: '',
        });
        handleClose();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === 'add_new_leave_type') {
      // Show the input field for adding a new leave type
      setShowAddLeaveType(true);
    } else {
      // Handle other changes to the leave type dropdown
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const updateLeaveData = (leave_type) => {
    setEditingLeave(leave_type);
    setFormData({
      leave_reason: leave_type.leave_reason,
      days_allowed: leave_type.days_allowed,
    });
    handleShow();
  };

  return (
    <div className="container mx-auto bg-white rounded-lg shadow-lg ml-15 pt-3 pb-8">
      <div className="main">
        <div className="flex justify-between items-center my-5">
          <div className="search">
            <form className="inline-flex">
              <input
                className="form-control mr-2"
                type="search"
                placeholder="Search leave_type"
                aria-label="Search"
              />
            </form>
          </div>
          <div className="text-green-500">
            <h5 className="font-bold text-lg">Leave Type Details</h5>
          </div>
          <div>
            <Button variant="primary" onClick={handleShow} className="mr-2">
              Add New leave_type
            </Button>
          </div>
        </div>
        {showAlert && (
              <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
              LeaveType added successfully!
            </Alert>
        )}
        <div className="flex justify-center">
          <div className="table-container">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Leave Reason</th>
                  <th>Days Allowed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leave_types &&
                  Array.isArray(leave_types) &&
                  leave_types.map((leave_type) => (
                    <tr key={leave_type.id}>
                      <td>{leave_type.leave_reason}</td>
                      <td>{leave_type.days_allowed}</td>
                      <td>
                        <Button variant="primary" onClick={() => updateLeaveData(leave_type)}>
                          Edit
                        </Button>{' '}
                        <Button variant="danger" onClick={() => deleteLeave(leave_type.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
        <div className="model_box">
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{editingLeave ? 'Edit Leave Type' : 'Add Leave Type'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="form-group mt-3">
                <label htmlFor="leave_reason">Enter Leave Type</label>
                {showAddLeaveType ? (
                  <input
                    className="form-control"
                    type="text"
                    name="leave_reason"
                    value={formData.leave_reason}
                    onChange={handleChange}
                  />
                ) : (
                  <select
                    className="form-control"
                    name="leave_reason"
                    id="leave_reason"
                    value={formData.leave_reason}
                    onChange={handleChange}
                  >
                    <option value="">Select Leave Type</option>
                    {leave_types.map((leave_type) => (
                      <option key={leave_type.id} value={leave_type.leave_reason}>
                        {leave_type.leave_reason}
                      </option>
                    ))}
                    <option value="add_new_leave_type" className='text-green-500 ftont-bold my-4'>Add New Leave Type</option>
                  </select>
                )}
              </div>

                <div className="m-1">
                  <label className="block text-sm font-bold mb-1">Enter Days Allowed</label>
                  <input
                    name="days_allowed"
                    value={formData.days_allowed}
                    onChange={handleChange}
                    className="border border-gray-400 rounded-md p-2 w-full"
                  />
                </div>

                <button type="submit" className="btn btn-success mt-4">
                  {editingLeave ? 'Save Changes' : 'Add leave_type'}
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
};

export { LeaveType };