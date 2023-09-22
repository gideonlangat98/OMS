import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';


const LeaveForm = ({ onUpdateForm, dashboardType, leave_types, formId, staffs, setStaffs, loggedInStaff, setLoggedInStaff }) => {
  const { backendUrl } = useContext(OmsContext);
  const [formData, setFormData] = useState({
    your_name: loggedInStaff,
    date_from: '',
    date_to: '',
    days_applied: '',
    leaving_type: '',
    reason_for_leave: '',
    staff_id: null,
  });

  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    if (formData.date_from && formData.date_to) {
      const startDate = new Date(formData.date_from);
      const endDate = new Date(formData.date_to);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setFormData((prevFormData) => ({
        ...prevFormData,
        days_applied: days.toString(),
      }));
    }
  }, [formData.date_from, formData.date_to]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `${backendUrl}/forms`;
      const token = localStorage.getItem('token');

      const response = await axios({
        method: 'POST',
        url: url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        const data = response.data;
        onUpdateForm(data);

        setFormData({
          your_name: '',
          date_from: '',
          date_to: '',
          days_applied: '',
          leaving_type: '',
          reason_for_leave: '',
        });


          setShowAlert(true);

        if (dashboardType === 'admin') {
          // Navigate to /admindashboard/leave-report for admin dashboard
        } else if (dashboardType === 'staff') {
          // Navigate to /stdashboard/leave-report for staff dashboard
        }
      } else {
        throw new Error(`Network response was not ok. Response status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  return (
    <div className='mx-auto bg-white rounded-lg shadow-lg ml-15 px-1 py-8 w-96'>
      <div>
        <Form onSubmit={handleSubmit} className='justify-center'>
          <h5 className='text-center text-xl font-bold mt-4 text-green-500'>
            Request Leave
          </h5>
          {showAlert && (
            <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
              Form submitted successfully!
            </Alert>
          )}
          <div className='ml-1'>
          <Form.Group controlId='formYourName'>
            <Form.Label>Staff Name</Form.Label>
            <Form.Control as='select' name='your_name' value={loggedInStaff} onChange={handleChange}>
              <option value={loggedInStaff}>
                {loggedInStaff}
              </option>
            </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDateFrom">
              <Form.Label>Please Enter Date From</Form.Label>
              <Form.Control
                type='date'
                name='date_from'
                value={formData.date_from}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDateTo">
              <Form.Label>Please Enter Date To</Form.Label>
              <Form.Control
                type='date'
                name='date_to'
                value={formData.date_to}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="daysApplied">
              <Form.Label>Enter No. of Days</Form.Label>
              <Form.Control
                type='number'
                name='days_applied'
                value={formData.days_applied}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formReasonForLeave">
              <Form.Label>Please Enter Reason For Leave</Form.Label>
              <Form.Control
                name='reason_for_leave'
                value={formData.reason_for_leave}
                onChange={handleChange}
              />
            </Form.Group>
                <Form.Group controlId="formLeaveType">
                  <Form.Label>Leave Type</Form.Label>
                  <Form.Control as="select" name="leaving_type" value={formData.leaving_type} onChange={handleChange}>
                    <option value="">Select Leave Type</option>
                    {leave_types &&
                      Array.isArray(leave_types) &&
                      leave_types.map((leave_type) => (
                        <option key={leave_type.id} value={leave_type.leave_reason}>
                          {leave_type.leave_reason} 
                        </option>
                      ))}
                  </Form.Control>
            </Form.Group>
          </div>
          <div className='flex justify-center'>
            <Button
              type='submit'
              onClick={handleSubmit}
              className='bg-blue-500 text-white font-bold py-2 px-4 mt-4 mr-5 rounded-md'
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LeaveForm;