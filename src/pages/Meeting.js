import React, { useState, useContext } from 'react';
import { Modal, Button, Table, Badge } from 'react-bootstrap';
import { BsEnvelope, BsPencil, BsTrash } from 'react-icons/bs';
import { OmsContext } from '../components/auth/AuthContext';

function convertToNairobiTime(timestamp) {
  if (timestamp) {
    const nairobiOffset = 3 * 60 * 60 * 1000; // Nairobi is 3 hours ahead (in milliseconds)
    const localTime = new Date(timestamp);
    const nairobiTime = new Date(localTime.getTime() + nairobiOffset);
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const timeStr = nairobiTime.toLocaleTimeString([], timeOptions);
    const dateStr = nairobiTime.toLocaleDateString([], dateOptions);
    return `${dateStr} ${timeStr}`;
  } else {
    return 'N/A';
  }
}

const Meeting = ({ staffs, events, deleteEvent, updateEvent, handleUpdateEvent }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    agenda: '',
    host: '',
    trainer: '',
    documents: null,
    meeting_link: '',
    email: '',
  });

  const [selectedStaffEmails, setSelectedStaffEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [createMeetModalShow, setCreateMeetModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { backendUrl } = useContext(OmsContext);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEmailSelect = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedStaffEmails([...selectedStaffEmails, value]);
    } else {
      setSelectedStaffEmails(selectedStaffEmails.filter((email) => email !== value));
    }
  };

  const handleSelectAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedStaffEmails(staffs.map((staff) => staff.email));
      setSelectAll(true);
    } else {
      setSelectedStaffEmails([]);
      setSelectAll(false);
    }
  };

  const handleCreateMeet = () => {
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('agenda', formData.agenda);
    formDataToSend.append('host', formData.host);
    formDataToSend.append('trainer', formData.trainer);
    formDataToSend.append('meeting_link', formData.meeting_link);

    if (formData.documents) {
      formDataToSend.append('documents', formData.documents);
    }

    const selectedEmail = selectedStaffEmails.length > 0 ? selectedStaffEmails[0] : 'default@example.com';
    formDataToSend.append('email', selectedEmail);

    formDataToSend.append('staff_emails', selectedStaffEmails.join(','));

    fetch(`${backendUrl}/events`, {
      method: 'POST',
      body: formDataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API response:', data);
        setCreateMeetModalShow(false);
        handleUpdateEvent(data);
        setFormData({
          date: '',
          time: '',
          agenda: '',
          host: '',
          trainer: '',
          documents: null,
          meeting_link: '',
          email: '',
        });
        setSelectedStaffEmails([]);
      })
      .catch((error) => {
        console.error('API error:', error);
      });
  };

  
  // Add a function to set the selected event for editing
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setFormData({
      date: event.date,
      time: event.time,
      agenda: event.agenda,
      host: event.host,
      trainer: event.trainer,
      meeting_link: event.meeting_link,
    });
    setEditModalShow(true);
  };

  // Add a function to update the selected event
  const handleUpdateSelectedEvent = () => {
    // Make an API call to update the selected event with formData
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('date', formData.date);
    formDataToSend.append('time', formData.time);
    formDataToSend.append('agenda', formData.agenda);
    formDataToSend.append('host', formData.host);
    formDataToSend.append('trainer', formData.trainer);
    formDataToSend.append('meeting_link', formData.meeting_link);

    // Append the documents only if they exist
    if (formData.documents) {
      formDataToSend.append('documents', formData.documents); // Attach the file
    }

    // Set "email" to the first selected staff email, or provide a default value
    const selectedEmail = selectedStaffEmails.length > 0 ? selectedStaffEmails[0] : 'default@example.com';
    formDataToSend.append('email', selectedEmail);

    formDataToSend.append('staff_emails', selectedStaffEmails.join(','));
    fetch(`${backendUrl}/events/${selectedEvent.id}`, {
      method: 'PUT',
      body: formDataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('Updated event:', response);
        // Close the edit modal here if needed
        setEditModalShow(false);
    
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error(`Network response was not ok. Response status: ${response.status}`);
        }
      })
      .then((data) => {
        if (data) {
          updateEvent(data);
        }
    
        setSelectedEvent(null);
        setFormData({
          date: '',
          time: '',
          agenda: '',
          host: '',
          trainer: '',
          documents: null,
          meeting_link: '',
          email: '',
        });
        setSelectedStaffEmails([]);
      })
      .catch((error) => {
        console.error('API error:', error);
      });
    };

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-right mb-4">
        <Button variant="primary" onClick={() => setCreateMeetModalShow(true)}>
          Create Meeting
        </Button>
      </div>

      <Modal show={createMeetModalShow} onHide={() => setCreateMeetModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    className="form-control focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="host" className="block text-sm font-medium text-gray-700">
                    Host
                  </label>
                  <input
                    type="text"
                    className="form-control focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    id="host"
                    name="host"
                    value={formData.host}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700">
                    Meeting Link
                  </label>
                  <input
                    type="text"
                    className="form-control focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    id="meeting_link"
                    name="meeting_link"
                    value={formData.meeting_link}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-4">
                  <label htmlFor="agenda" className="block text-sm font-medium text-gray-700">
                    Agenda
                  </label>
                  <textarea
                    className="form-control focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    id="agenda"
                    name="agenda"
                    value={formData.agenda}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="trainer" className="block text-sm font-medium text-gray-700">
                    Trainer
                  </label>
                  <input
                    type="text"
                    className="form-control focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    id="trainer"
                    name="trainer"
                    value={formData.trainer}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                    Upload Document
                  </label>
                  <input
                    type="file"
                    className="form-control-file focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    id="documents"
                    name="documents"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Select Staff Emails</label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="selectAll"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <label className="form-check-label" htmlFor="selectAll">
                      Select All
                    </label>
                  </div>
                  {staffs.map((staff) => (
                    <div className="form-check" key={staff.id}>
                      <input
                        type="checkbox"
                        id={staff.email}
                        className="form-check-input"
                        value={staff.email}
                        checked={selectedStaffEmails.includes(staff.email)}
                        onChange={handleEmailSelect}
                      />
                      <label className="form-check-label cols-2" htmlFor={staff.email}>
                        {staff.email}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCreateMeetModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateMeet}>
            Send Invite <BsEnvelope className="relative" />
          </Button>
        </Modal.Footer>
      </Modal>

      <Table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Agenda</th>
            <th className="border border-gray-300 p-2">Host</th>
            <th className="border border-gray-300 p-2">Trainer</th>
            <th className="border border-gray-300 p-2">Documents Attached</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events &&
            Array.isArray(events) &&
            events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-200">
                <td className="border border-gray-300 p-2">{event.date}</td>
                <td className="border border-gray-300 p-2">
                  <Badge bg="primary" className="p-2">
                    {convertToNairobiTime(event.time)}
                  </Badge>
                </td>
                <td className="border border-gray-300 p-2">{event.agenda}</td>
                <td className="border border-gray-300 p-2">{event.host}</td>
                <td className="border border-gray-300 p-2">{event.trainer}</td>
                <td className="border border-gray-300 p-2"><a href={event.meeting_link} target="_blank">{event.meeting_link}</a></td>
                <td className="border border-gray-300 p-2">
                  {event.documents ? (
                    <div>
                      <a href={`${backendUrl}/events/${event.id}/download_document`} download>
                        Download File
                      </a>
                      <div>{event.documents.name}</div>
                    </div>
                  ) : (
                    <div className="border-dashed border-gray-300 p-2 text-gray-500">
                      <input type="file" className="form-control-file" name="documents" onChange={handleChange} />
                      <p className="text-center mt-1">Drag and drop files here or click to browse</p>
                      <Button variant="secondary" size="sm" className="mt-2">
                        Upload Document
                      </Button>
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <Button
                    variant="primary"
                    className="mr-2"
                    onClick={() => handleEditEvent(event)}
                    title="Edit"
                  >
                    <BsPencil />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteEvent(event.id)}
                    title="Delete"
                  >
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Event</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form className="w-full">
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          className="form-control"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Time</label>
        <input
          type="time"
          className="form-control"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Agenda</label>
        <textarea
          className="form-control"
          name="agenda"
          value={formData.agenda}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Host</label>
        <input
          type="text"
          className="form-control"
          name="host"
          value={formData.host}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Trainer</label>
        <input
          type="text"
          className="form-control"
          name="trainer"
          value={formData.trainer}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Meeting Link</label>
        <input
          type="text"
          className="form-control"
          name="meeting_link"
          value={formData.meeting_link}
          onChange={handleChange}
        />
      </div>
    </form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setEditModalShow(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleUpdateSelectedEvent}>
      Update
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default Meeting;