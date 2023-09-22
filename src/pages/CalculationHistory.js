import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define CSS classes for leave status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return styles.pendingStatus;
    case 'Approved':
      return styles.approvedStatus;
    case 'Declined':
      return styles.declinedStatus;
    default:
      return styles.defaultStatus;
  }
};

const LeaveHistory = ({ forms, deleteForms, userType }) => {
  const [showPdf, setShowPdf] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [shownNotifications, setShownNotifications] = useState([]);

  const handleDownloadPdf = () => {
    setShowPdf(true);
  };

  const handlePdfClosed = () => {
    setShowPdf(false);
  };

  // Function to show pop-up message
  const showStatusChangeMessage = (form) => {
    if ((form.status === 'Approved' || form.status === 'Declined') &&
        !shownNotifications.includes(form.id)) { // Check if notification has not been shown
      setPopupMessage(`Leave has been: ${form.status}`);
      setPopupColor(form.status === 'Approved' ? 'green' : 'red'); // Set the color based on status
      setShowPopup(true);
      setShownNotifications([...shownNotifications, form.id]);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // useEffect hook to show the pop-up message when the status changes
  useEffect(() => {
    if (popupMessage) {
      setShowPopup(true);
    }
  }, [popupMessage]);


  // useEffect hook to check for leave status changes and show the pop-up message
  useEffect(() => {
    forms.forEach((form) => {
      showStatusChangeMessage(form);
    });
  }, [forms]);

  return (
    <div>
      <div className="mx-auto bg-white rounded-lg shadow-lg ml-15 px-5 pb-8 pt-3">
        <div className="manager-details">
          <div className="row">
            <div className="col-sm-3 mt-5 mb-4 text-gred">
              <div className="search">
                <form className="form-inline">
                  <input
                    className="form-control mr-sm-2"
                    type="search"
                    placeholder="Search history"
                    aria-label="Search"
                  />
                </form>
              </div>
            </div>
            <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: 'green' }}>
              <h3>
                <b>Leave Requests History</b>
              </h3>
            </div>
            <div className="col-sm-3 mt-5 mb-4 text-right">
              {showPdf ? (
                <PDFDownloadLink
                  document={<LeaveHistoryPdf forms={forms} userType={userType} />}
                  fileName="leave_history.pdf"
                  style={{ textDecoration: 'none' }}
                  onClick={handlePdfClosed}
                >
                  {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                </PDFDownloadLink>
              ) : (
                <Button variant="primary" onClick={handleDownloadPdf}>
                  Download PDF
                </Button>
              )}
            </div>
          </div>
          <div className="row">
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered table-sm">
                <thead>
                  <tr>
                    {userType === 'admin' && <th>Name</th>}
                    <th>Date From</th>
                    <th>Date To</th>
                    <th>Reason For Leave</th>
                    <th>Leaving Type</th>
                    <th>Leave Status</th>
                    {userType === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {forms &&
                    Array.isArray(forms) &&
                    forms.map((form) => (
                      <tr key={form.id}>
                        {userType === 'admin' && <td>{form.your_name}</td>}
                        <td>{form.date_from}</td>
                        <td>{form.date_to}</td>
                        <td>{form.reason_for_leave}</td>
                        <td>{form.leaving_type}</td>
                        <td className={getStatusColor(form.status)}>{form.status}</td>
                        <td className="text-center">
                          {userType === 'admin' && (
                            <div className="d-flex justify-content-center">
                              <Button variant="danger" onClick={() => deleteForms(form.id)}>
                                Delete
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modern pop-up modal */}
      <Modal show={showPopup} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ color: popupColor }}>{popupMessage}</div> {/* Set the color dynamically */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClosePopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// PDF Document component
const LeaveHistoryPdf = ({ forms, userType }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>Leave Requests History</Text>
      <View style={styles.tableRow}>
        {userType === 'admin' && <Text style={styles.tableCell}>Name</Text>}
        <Text style={styles.tableCell}>Date From</Text>
        <Text style={styles.tableCell}>Date To</Text>
        <Text style={styles.tableCell}>Reason For Leave</Text>
        <Text style={styles.tableCell}>Leaving Type</Text>
        <Text style={styles.tableCell}>Leave Status</Text>
      </View>
      {forms &&
        Array.isArray(forms) &&
        forms.map((form) => (
          <View key={form.id} style={styles.tableRow}>
            {userType === 'admin' && <Text style={styles.tableCell}>{form.your_name}</Text>}
            <Text style={styles.tableCell}>{form.date_from}</Text>
            <Text style={styles.tableCell}>{form.date_to}</Text>
            <Text style={styles.tableCell}>{form.reason_for_leave}</Text>
            <Text style={styles.tableCell}>{form.leaving_type}</Text>
            <Text style={getStatusColor(form.status)}>{form.status}</Text>
          </View>
        ))}
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#f8f9fa', // Set the background color to match the LeaveHistory page
    padding: '1cm',
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#0f5132', // Set the heading color to match the LeaveHistory page
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: '#e9ecef', // Set the table row background color to match the LeaveHistory page
  },
  tableCell: {
    flex: 1,
    padding: '5px',
    textAlign: 'center',
    color: '#0f5132', // Set the table cell text color to match the LeaveHistory page
  },
  pendingStatus: {
    color: 'orange',
  },
  approvedStatus: {
    color: 'green',
  },
  declinedStatus: {
    color: 'red',
  },
  defaultStatus: {
    color: 'black',
  },
});

export default LeaveHistory;