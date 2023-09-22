import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { OmsContext } from '../components/auth/AuthContext';


function LeaveRequest({ forms, setForms, leaveCalculations, leave_types, setLeaveCalculations }) {
  const { backendUrl } = useContext(OmsContext);
  const [showNotification, setShowNotification] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const showNotificationModal = () => {
    setShowNotification(true);
  };

  const hideNotificationModal = () => {
    setShowNotification(false);
  };

  const updateForm = async (id, newData) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

      await axios.put(`${backendUrl}/forms/${id}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the request headers
        },
      });
      // Handle success if necessary
    } catch (error) {
      // Handle error if necessary
      console.error('Error updating form:', error);
    }
  };

  const approveForm = async (index) => {
    try {
      const form = forms[index];
      const updatedForm = { ...form, status: 'Approved' };
  
      const leaveType = leave_types.find(
        (lt) => lt.leave_reason === updatedForm.leaving_type
      );
  
      if (!leaveType) {
        console.error('Leave type not found for the form.');
        return;
      }
  
      const approvedUsedDays = forms
        .filter(
          (f) =>
            f.staff_id === updatedForm.staff_id &&
            f.leaving_type === updatedForm.leaving_type &&
            f.status === 'Approved'
        )
        .reduce((total, f) => total + f.days_applied, 0);
  
      const newUsedDays = updatedForm.days_applied;
  
      if (approvedUsedDays + newUsedDays > leaveType.days_allowed) {
        showNotificationModal();
        return;
      }
  
      // Update form status to 'Approved' in forms array
      setForms((prevForms) => {
        const updatedForms = [...prevForms];
        updatedForms[index] = updatedForm;
        return updatedForms;
      });
  
      // Update form status on the server
      await updateForm(form.id, updatedForm);
  
      // Calculate and update leave calculations based on approvedForm
      const updatedCalculations = leaveCalculations.map((calculation) => {
        if (
          calculation.staff_id === updatedForm.staff_id &&
          calculation.leave_type === updatedForm.leaving_type
        ) {
          calculation.available_days =
            calculation.days_allowed - (approvedUsedDays + newUsedDays);
        }
        return calculation;
      });
  
      setLeaveCalculations(updatedCalculations);
    } catch (error) {
      console.error('Failed to update form:', error);
    }
  };  
  
  const declineForm = async (id) => {
    const form = forms.find((f) => f.id === id);
    const updatedForm = { ...form, status: 'Declined' };
  
    try {
      await updateForm(id, updatedForm);
      setForms((prevForms) => {
        const updatedForms = prevForms.map((f) => {
          if (f.id === id) {
            return updatedForm;
          }
          return f;
        });
        return updatedForms;
      });
    } catch (error) {
      console.error('Failed to decline form:', error);
    }
  };
  
  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg ml-12 px-5 pb-8 pt-3">
      <div className="requests">
        <div className="row">
          <div className="col-md-8 offset-md-2 mt-3 mb-4 text-gred" style={{ color: 'green' }}>
            <h5 className="text-center">
              <b>Leave Request Details</b>
            </h5>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered table-sm">
                <thead>
                  <tr>
                    <th className="text-center align-middle">Staff Name</th>
                    <th className="text-center align-middle">Date From</th>
                    <th className="text-center align-middle">Date To</th>
                    <th className="text-center align-middle">Reason For Leave</th>
                    <th className="text-center align-middle">Leave Type</th>
                    <th className="text-center align-middle">Days Applied</th>
                    <th className="text-center align-middle">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {forms &&
                    Array.isArray(forms) &&
                    forms.map((form, index) => (
                      <tr key={form.id}>
                        <td className="text-center align-middle">{form.your_name}</td>
                        <td className="text-center align-middle">{form.date_from}</td>
                        <td className="text-center align-middle">{form.date_to}</td>
                        <td className="text-center align-middle">{form.reason_for_leave}</td>
                        <td className="text-center align-middle">{form.leaving_type}</td>
                        <td className="text-center align-middle">{form.days_applied}</td>
                        <td className="text-center align-middle">
                          <span
                            className={`status-badge ${
                              form.status === 'Approved'
                                ? 'approved'
                                : form.status === 'Declined'
                                ? 'declined'
                                : ''
                            }`}
                          >
                            {form.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="d-flex align-items-center m-1">
                            <Button
                              variant="success"
                              className="mr-2"
                              onClick={() => approveForm(index)}
                              disabled={form.status === 'Approved'}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => declineForm(form.id)}
                              disabled={form.status === 'Declined'}
                            >
                              Decline
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal show={showNotification} onHide={hideNotificationModal}>
        <Modal.Header closeButton>
          <Modal.Title>No More Days Left for Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have exceeded the available leave days for this leave type.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideNotificationModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
}

export default LeaveRequest;