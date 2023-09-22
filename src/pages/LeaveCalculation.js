import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from 'react-bootstrap';

function LeaveCalculation({ forms, leave_types, leave_calculations, staffs }) {

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
              <b>Leave Calculations</b>
            </h3>
          </div>
        </div>
        <div className="row">
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered table-sm">
            <thead>
              <tr>
                <th>Staff Details</th>
                <th>Leave Types</th>
                <th>Total Days</th>
                <th>Used Days</th>
                <th>Available Days</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => {
                const staffCalculations = leave_calculations.filter(
                  (calculation) => calculation.staff_details === staff.staff_name
                );

                return (
                  <tr key={staff.id}>
                    <td>{staff.staff_name}</td>
                    <td>
                      <ul>
                        {leave_types.map((leave_type) => (
                          <li key={leave_type.id}>{leave_type.leave_reason}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <ul>
                        {leave_types.map((leave_type) => (
                          <li key={leave_type.id}>{leave_type.days_allowed}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                  <ul>
                    {leave_types.map((leave_type) => {
                      const formsForStaffAndType = forms.filter(
                        (f) =>
                          f.your_name === staff.staff_name &&
                          f.leaving_type === leave_type.leave_reason
                      );

                      const totalUsedDays = formsForStaffAndType.reduce(
                        (total, f) =>
                          f.status === 'Approved' // Only deduct for approved forms
                            ? total + f.days_applied
                            : total,
                        0
                      );

                      return (
                        <li key={leave_type.id}>{totalUsedDays}</li>
                      );
                    })}
                  </ul>
                </td>
                <td>
                  {/* Display available days based on form status */}
                  <ul>
                    {leave_types.map((leave_type) => {
                      const calculation = leave_calculations.find(
                        (c) =>
                          c.staff_id === staff.id &&
                          c.leave_type === leave_type.id
                      );

                      const totalDays = leave_type.days_allowed;
                      const usedDays = forms
                        .filter(
                          (form) =>
                            form.your_name === staff.staff_name &&
                            form.leaving_type === leave_type.leave_reason &&
                            form.status === 'Approved' // Only deduct for approved forms
                        )
                        .reduce((total, form) => total + form.days_applied, 0);

                      const availableDays = totalDays - usedDays;

                      return (
                        <li key={leave_type.id}>{availableDays}</li>
                      );
                    })}
                  </ul>
                </td>

                    <td>
                      <div className="flex">
                        <Button variant="danger" className="mr-2">Delete</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LeaveCalculation;