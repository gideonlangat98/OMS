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
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  subDays,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

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
  try {
    if (timestamp) {
      const indianTimeZone = 'Asia/Kolkata';
      const utcTime = parseISO(timestamp);
      if (isNaN(utcTime.getTime())) {
        return 'Invalid Date'; // Handle invalid date values
      }
      const indianTime = utcToZonedTime(utcTime, indianTimeZone);
      return format(indianTime, "yyyy-MM-dd HH:mm:ss");
    } else {
      return 'N/A';
    }
  } catch (error) {
    console.error('Error converting to Indian time:', error);
    return 'Error';
  }
}


function CheckStatus({ check_in_outs, deleteStatus }) {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Set to the current date by default
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date())); // Set to the current month by default
  const [selectedRange, setSelectedRange] = useState('today'); // Store selected time range ('today', 'last24hours', 'currentMonth', 'last3months')

  // Function to handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedMonth(null); // Reset selected month
    setSelectedRange(null); // Reset selected time range
  };

  // Function to filter data by selected month
  const filterByMonth = (month) => {
    setSelectedMonth(month);
    setSelectedDate(null); // Reset selected date
    setSelectedRange(null); // Reset selected time range
  };

  // Function to filter data by time range
  const filterByRange = (range) => {
    setSelectedRange(range);
    setSelectedDate(null); // Reset selected date
    setSelectedMonth(null); // Reset selected month
  };

  // Generate options for all months from January to December
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const monthDate = new Date(new Date().getFullYear(), i, 1); // Set the year to the current year
    return monthDate;
  });

  // Filter the data based on the selected date, month, or time range
  const filteredData = check_in_outs.filter((check_in_out) => {
    const checkInDate = new Date(check_in_out.check_in);
    if (selectedDate) {
      const selectedDateStart = startOfDay(selectedDate);
      const selectedDateEnd = endOfDay(selectedDate);
      return checkInDate >= selectedDateStart && checkInDate <= selectedDateEnd;
    } else if (selectedMonth) {
      const startOfMonthDate = startOfMonth(selectedMonth);
      const endOfMonthDate = endOfMonth(selectedMonth);
      return checkInDate >= startOfMonthDate && checkInDate <= endOfMonthDate;
    } else if (selectedRange === 'last24hours') {
      const last24Hours = subDays(new Date(), 1);
      return checkInDate >= last24Hours;
    } else if (selectedRange === 'currentMonth') {
      const currentMonth = startOfMonth(new Date());
      const nextMonth = addMonths(currentMonth, 1);
      return checkInDate >= currentMonth && checkInDate < nextMonth;
    } else if (selectedRange === 'last3months') {
      const last3Months = subDays(new Date(), 90);
      return checkInDate >= last3Months;
    }
    return true; // Show all if no date, month, or range is selected
  });

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg ml-15 px-5 pb-8 pt-3">
      <div className="manager-details">
        <div className="row justify-content-center">
          <div className="col-sm-3 mt-5 mb-4 text-gred">
            <div className="search">
              <form className="form-inline">
                <input className="form-control mr-sm-2" type="search" placeholder="Search Check Status" aria-label="Search" />
              </form>
            </div>
          </div>
          <div className="col-sm-3 mt-5 mb-4 text-gred" style={{ color: 'green' }}>
            <h3>
              <b>Check In Status Details</b>
            </h3>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-3">
            <div className="mt-3">
              {/* Date Picker for selecting date */}
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select Date"
                className="text-center p-2 text-black rounded-md bg-gray-200 border-solid border-1 border-blue-500"
              />
            </div>
          </div>
          <div className="col-sm-3">
            <div className="mt-3">
              {/* Dropdown for selecting month */}
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : "Select Month"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {monthOptions.map((month, index) => (
                    <Dropdown.Item key={index} onClick={() => filterByMonth(month)}>
                      {format(month, "MMMM yyyy")}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="mt-3">
              {/* Dropdown for selecting time range */}
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  {selectedRange ? `Last ${selectedRange}` : "Select Time Range"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => filterByRange('24hours')}>Last 24 Hours</Dropdown.Item>
                  <Dropdown.Item onClick={() => filterByRange('currentMonth')}>Current Month</Dropdown.Item>
                  <Dropdown.Item onClick={() => filterByRange('3months')}>Last 3 Months</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
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
