import React, { useState, useContext } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';
import axios from 'axios';

const Client = ({ onUpdateClient, clients, deleteClients, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const {backendUrl} = useContext(OmsContext);

  const [formData, setFormData] = useState({
    client_name: '',
    description: '',
    main_email: '',
    second_email: '',
    first_contact: '',
    second_contact: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingClient
        ? `${backendUrl}/clients/${editingClient.id}`
        : `${backendUrl}/clients`;

      const method = editingClient ? 'PUT' : 'POST';

      const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the request headers
        },
      });

      if (response.status === 201 || response.status === 200) {
        const data = response.data;
        if (editingClient) {
          // Update the existing client
          onUpdate(data);
          setEditingClient(null);
        } else {
          // Create a new client
          onUpdateClient(data);
        }
        setShowAlert(true);

        setFormData({
          client_name: '',
          description: '',
          main_email: '',
          second_email: '',
          first_contact: '',
          second_contact: '',
        });
        setShowModal(false);
      } else {
        throw new Error(`Network response was not ok. Response status: ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setFormData({
      client_name: client.client_name,
      description: client.description,
      main_email: client.main_email,
      second_email: client.second_email,
      first_contact: client.first_contact,
      second_contact: client.second_contact,
    });
    setShowModal(true);
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({
      client_name: '',
      description: '',
      main_email: '',
      second_email: '',
      first_contact: '',
      second_contact: '',
    });
    setShowModal(true);
  };

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg ml-15 px-5 pt-3 pb-8">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="text-center text-green">
          <h3>Clients</h3>
        </div>
        <div>
          <Button variant="primary" onClick={handleAddClient} style={{ marginTop: '10px', marginBottom: '3px' }}>
            Add New Client
          </Button>
        </div>
      </div>
      {showAlert && (
        <Alert variant='success' onClose={() => setShowAlert(false)} dismissible>
          Client added successfully!
        </Alert>
      )}

      {/* Modal for adding/editing client */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingClient ? 'Edit Client' : 'Add Client'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formClientName">
              <Form.Label>Client Name</Form.Label>
              <Form.Control type="text" name="client_name" value={formData.client_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>First Email</Form.Label>
              <Form.Control as="textarea" name="main_email" value={formData.main_email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Second Email</Form.Label>
              <Form.Control as="textarea" name="second_email" value={formData.second_email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formFirstContact">
              <Form.Label>First Contact</Form.Label>
              <Form.Control
                type="number" 
                name="first_contact"
                value={formData.first_contact}
                onChange={handleChange}
              />
              </Form.Group>
              <Form.Group controlId="formSecondContact">
              <Form.Label>Second Contact</Form.Label>
              <Form.Control
                type="number"
                name="second_contact"
                value={formData.second_contact}
                onChange={handleChange}
              />
              </Form.Group>
            <Button variant="primary" type="submit" style={{ marginTop: '9px' }}>
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Table to display clients */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Description</th>
            <th>First Email</th>
            <th>Alternative Email</th>
            <th>First Contact</th>
            <th>Alternative Contact</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {clients &&
            Array.isArray(clients) &&
            clients.map((client) => (
              <tr key={client.id}>
                <td>{client.client_name}</td>
                <td>{client.description}</td>
                <td>{client.main_email}</td>
                <td>{client.second_email}</td>
                <td>{client.first_contact}</td>
                <td>{client.second_contact}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEditClient(client)}>
                    Edit
                  </Button>{' '}
                  <Button variant="danger" onClick={() => deleteClients(client.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Client;
