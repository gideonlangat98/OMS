import React, { useState, useContext } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Table } from 'react-bootstrap';
import { OmsContext } from '../components/auth/AuthContext';

const Projects = ({ projects, deleteProjects, userType, usingType, managers, handleUpdateProject, handleUpdateProjects, clients }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {backendUrl} = useContext(OmsContext);

  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    client_details: "",
    project_managers: "",
    task_managers: "",
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const url = editingProject
      ? `${backendUrl}/projects/${editingProject.id}`
      : `${backendUrl}/projects`;

    const method = editingProject ? 'PUT' : 'POST';


    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201 || response.status === 200) {
        const data = await response.json();

        if (editingProject) {
          // Update the existing project
          handleUpdateProject(data);
          setEditingProject(null);
        } else {
          // Create a new project
          handleUpdateProjects(data);
        }

        setFormData({
          project_name: "",
          description: "",
          client_details: "",
          project_managers: "",
          task_managers: "",
        });
        handleClose();
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

  const updateData = (project) => {
    setEditingProject(project);
    setFormData({
      project_name: project.project_name,
      description: project.description,
      client_details: project.client_details,
      project_managers: project.project_managers,
      task_managers: project.task_managers,
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
                placeholder="Search Project"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </form>
          </div>
          <div className="text-green-500">
            <h5 className="font-bold text-lg">Projects Details</h5>
          </div>
          {userType === 'admin' && usingType=== 'manager' && (
          <div>
            <Button variant="primary" onClick={handleShow}>
              Add New Project
            </Button>
          </div>
        )}
        </div>
        <div className="flex justify-center">
          <div className="table-container">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Client Name</th>
                  <th>Project manager</th>
                  <th>Task Manager</th>
                  {userType === 'admin' && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.project_name}</td>
                    <td>{project.description}</td>
                    <td>{project.client_details}</td>
                    <td>{project.project_managers}</td>
                    <td>{project.task_managers}</td>
                    <td>
                      {userType === 'admin' && usingType=== 'manager' && (
                        <Button variant="info" onClick={() => updateData(project)}>
                        Edit
                      </Button>
                      )}
                      {userType === 'admin' && usingType=== 'manager' && (
                        <Button variant="danger" className="ml-2" onClick={() => deleteProjects(project.id)}>
                        Delete
                      </Button>
                      )}

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
              <Modal.Title>Add Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="project_name"
                    placeholder="Enter Project Name"
                    value={formData.project_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    placeholder="Enter Description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="client_details">Client Name</label>
                  <select
                    className="form-control"
                    name="client_details"
                    id="client_details"
                    value={formData.client_details}
                    onChange={handleChange}
                  >
                    <option value="">Select Client</option>
                    {clients &&
                      Array.isArray(clients) &&
                      clients.map((client) => (
                        <option key={client.id} value={client.client_name}>
                          ID: {client.id} Name: {client.client_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="client_details">Project Manager</label>
                  <select
                    className="form-control"
                    name="project_managers"
                    id="project_managers"
                    value={formData.project_managers}
                    onChange={handleChange}
                  >
                    <option value="">Select Manager</option>
                    {managers &&
                      Array.isArray(managers) &&
                      managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          ID: {manager.id} Name: {manager.f_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="client_details">Task Manager</label>
                  <select
                    className="form-control"
                    name="task_managers"
                    id="task_managers"
                    value={formData.task_managers}
                    onChange={handleChange}
                  >
                    <option value="">Select Manager</option>
                    {managers &&
                      Array.isArray(managers) &&
                      managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          ID: {manager.id} Name: {manager.f_name}
                        </option>
                      ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-success mt-4">
                  {editingProject ? 'Save Changes' : 'Add Project'}
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

export default Projects;