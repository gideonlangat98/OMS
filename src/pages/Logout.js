import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import {
  Button,
  Dropdown,
} from 'react-bootstrap';
import {
  format,
  parseISO,
  differenceInHours,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function calculateDuration(check_in, check_out) {
  if (check_in && check_out) {
    const checkInTime = new Date(check_in);
    const checkOutTime = new Date(check_out);
    const durationInMillis = checkOutTime - checkInTime;
    const hours = Math.floor(durationInMillis / (1000 * 60 * 60));
    const minutes = Math.floor((durationInMillis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationInMillis % (1000 * 60)) / 1000);
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
  } else {
    return 'N/A';
  }
}

function convertToIndianTime(timestamp) {
  if (timestamp) {
    const indianTimeZone = 'Asia/Kolkata';
    const utcTime = parseISO(timestamp);
    const indianTime = utcToZonedTime(utcTime, indianTimeZone);
    return format(indianTime, "yyyy-MM-dd HH:mm:ss");
  } else {
    return 'N/A';
  }
}

function CheckStatus({ check_in_outs, deleteStatus }) {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Add state for selected date

  // Function to handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Filter the data based on the selected date
  const filteredData = check_in_outs.filter((check_in_out) => {
    const checkInDate = new Date(check_in_out.check_in).toDateString();
    const selectedDateStr = selectedDate ? selectedDate.toDateString() : null;
    return selectedDateStr === checkInDate;
  });

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg ml-15 px-5 pb-8 pt-3">
      <div className="manager-details">
        <div className="row">
          <div className="col-sm-3 mt-5 mb-4 text-gred">
            <div className="search">
              <form className="form-inline">
                <input className="form-control mr-sm-2" type="search" placeholder="Search Check Status" aria-label="Search" />
              </form>
            </div>
          </div>
          <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: 'green' }}>
            <h3>
              <b>Check In Status Details</b>
            </h3>
          </div>
          <div className="col-sm-3">
            <div className="mt-3">
              {/* Date Picker for selecting date */}
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Date"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead>
                <tr>
                  <th>Staff Id</th>
                  <th>Staff Name</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Duration</th>
                  <th>Online Status</th>
                  <th>Last Seen</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((check_in_out) => (
                  <tr key={check_in_out.id}>
                    <td>{check_in_out.staff_id}</td>
                    <td>{check_in_out.name}</td>
                    <td className='text-center'><div className='border-solid border-1 bg-green-500 text-white font-bold px-2 py-2 rounded-lg'>{convertToIndianTime(check_in_out.check_in)}</div></td>
                    <td className='text-center'><div className='border-solid border-1 bg-green-500 text-white font-bold px-2 py-2 rounded-lg'>{convertToIndianTime(check_in_out.check_out)}</div></td>
                    <td className='text-center'><div className='border-solid border-1 bg-green-500 text-white font-bold px-2 py-2 rounded-lg'>{calculateDuration(check_in_out.check_in, check_in_out.check_out)}</div></td>
                    <td className='text-center'><div className='border-solid border-1 bg-blue-500 text-white px-2 py-2 rounded-lg mt-2'>{check_in_out.online_state}</div></td>
                    <td className='text-center'><div className='border-solid border-1 bg-fuchsia-200 text-blue px-2 py-2 rounded-lg'>{convertToIndianTime(check_in_out.last_logged)}</div></td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center">
                        <Button variant="danger" onClick={() => deleteStatus(check_in_out.id)}>
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
      </div>
    </div>
  );
}

export default CheckStatus;
