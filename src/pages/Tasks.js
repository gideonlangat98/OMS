import React, { useState, useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import TaskProgress from './TaskProgress';
import Request from './Request';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { OmsContext } from '../components/auth/AuthContext';

const Tasks = ({ staffs, managers, progresses, loggedInStaff, updateProgress, useType, deleteProgress, handleUpdateProgress, projects, requests, deleteRequest, updateRequest, handleUpdateRequest, deleteTask, userType, tasks, setTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [form, setForm] = useState({
    assignment_date: '',
    task_name: '',
    assigned_to: '',
    task_manager: '',
    project_manager: '',
    project_name: '',
    task_deadline: '',
    avatarFiles: [],
    completedFiles: [],
  });

  const { backendUrl } = useContext(OmsContext);

  const [selectedTask, setSelectedTask] = useState(null);

  const [showRequests, setShowRequests] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const toggleRequests = () => {
    setShowRequests(!showRequests);
  };

  const toggleProgress = () => {
    setShowProgress(!showProgress);
  }

  const getSelectedTaskData = () => {
    if (!selectedTask) return null;
    return tasks.find((task) => task.id === selectedTask);
  };

  useEffect(() => {
    if( tasks && tasks.length > 0) {
      setSelectedTask(tasks[0].id);
    }
  }, [tasks])
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDrop = (acceptedFiles, field) => {
    setForm((prevData) => ({
      ...prevData,
      [field]: acceptedFiles,
    }));
  };

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleDrop(acceptedFiles, 'avatarFiles'),
    accept: 'image/*',
    multiple: false,
  });

  const handleCompletedFilesDrop = (acceptedFiles) => {
    console.log('Accepted files:', acceptedFiles);

    setForm((prevData) => {
      console.log('Previous form data:', prevData);
      return {
        ...prevData,
        completedFiles: acceptedFiles,
      };
    });
  };

  const { getRootProps: getCompletedFilesRootProps, getInputProps: getCompletedFilesInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleCompletedFilesDrop(acceptedFiles),
    accept: '.jpg, .jpeg, .png, .pdf, .docx, .txt, .mp4, .avi, .mov',
    multiple: true,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append('assignment_date', form.assignment_date);
      formData.append('task_name', form.task_name);
      formData.append('assigned_to', form.assigned_to);
      formData.append('task_manager', form.task_manager);
      formData.append('project_manager', form.project_manager);
      formData.append('project_name', form.project_name);
      formData.append('task_deadline', form.task_deadline);

      form.avatarFiles.forEach((file) => {
        formData.append('avatar_image', file);
      });

      form.completedFiles.forEach((file) => {
        formData.append('completed_files[]', file); // Send completed files as an array
      });

      const method = editingTaskId ? 'put' : 'post';
      const endpoint = editingTaskId
        ? `${backendUrl}/tasks/${editingTaskId}/upload_completed_files`
        : `${backendUrl}/tasks`;

      const taskConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios[method](endpoint, formData, taskConfig);
      console.log('Task created/updated successfully!', response.data);

      if (editingTaskId) {
        // Find the index of the edited task in the tasks array
        const editedTaskIndex = tasks.findIndex((task) => task.id === response.data.id);

        // Update the tasks array with the new task information
        setTasks((prevTasks) => {
          const updatedTasks = [...prevTasks];
          updatedTasks[editedTaskIndex] = response.data;
          return updatedTasks;
        });
      } else {
        // Add the newly created task to the tasks array
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }

      setForm({
        assignment_date: '',
        task_name: '',
        assigned_to: '',
        task_manager: '',
        project_manager: '',
        project_name: '',
        task_deadline: '',
        completedFiles: [], // Reset completedFiles state
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error creating/updating task:', error);
    }
  };

  const handleEdit = (task) => {
    setForm((prevForm) => ({
      ...prevForm,
      assignment_date: task.assignment_date || '',
      task_name: task.task_name || '',
      assigned_to: task.assigned_to || '', // Make sure assigned_to is defined or use an empty string
      task_manager: task.task_manager || '',   // Make sure managed_by is defined or use an empty string
      project_manager: task.project_manager || '',
      project_name: task.project_name || '', // Make sure project_name is defined or use an empty string
      task_deadline: task.task_deadline || '',
      avatarFiles: [],
    }));
    setEditingTaskId(task.id);
    setShowModal(true);
  };

  const handleDownloadCompletedFile = async (taskId, fileIndex) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${backendUrl}/tasks/${taskId}/download_completed_file/${fileIndex}`,
      {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const blob = new Blob([response.data], { type: response.data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `completed_file_${fileIndex}.${response.data.type.split('/')[1]}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="container mx-auto bg-white rounded-lg shadow-lg ml-8 pt-3 pb-8">
      <div className="flex justify-between mb-5">
        <div className="text-center text-green">
          <h3>Tasks</h3>
        </div>
        <div>
          {userType === 'admin' && (
            <Button
              variant="primary"
              onClick={() => {
                setShowModal(true);
                setEditingTaskId(null);
                setForm({
                  assignment_date: '',
                  task_name: '',
                  assigned_to: '',
                  task_manager: '',
                  project_manager: '',
                  project_name: '',
                  task_deadline: '',
                  avatarFiles: [],
                  completedFiles: [],
                });
              }}
              style={{ marginTop: '10px', marginBottom: '3px' }}
            >
              Add New Task
            </Button>
          )}
        </div>
      </div>
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
            {userType === 'admin' && (
            <div>
              <Form.Group controlId="formDateFrom">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type='date'
                name='assignment_date'
                value={form.assignment_date}
                onChange={handleChange}
              />
             </Form.Group>
            </div>
            )}
            {userType === 'admin' && (
              <div>
                <Form.Group controlId="formTaskname">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control type="text" name="task_name" value={form.task_name} onChange={handleChange} />
                </Form.Group>
              </div>
              )}
              {userType === 'admin' && (
              <div>
                <Form.Group controlId="formAssigned">
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Control as="select" name="assigned_to" value={form.assigned_to} onChange={handleChange}>
                    <option value="">Select Staff</option>
                    {staffs &&
                      Array.isArray(staffs) &&
                      staffs.map((staff) => (
                        <option key={staff.id} value={staff.staff_name}>
                          ID: {staff.id} - Name: {staff.staff_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
            {userType === 'admin' && (
              <div>
                <Form.Group controlId="formManaged">
                  <Form.Label>Task Manager</Form.Label>
                  <Form.Control as="select" name="task_manager" value={form.task_manager} onChange={handleChange}>
                    <option value="">Select Managers</option>
                    {managers &&
                      Array.isArray(managers) &&
                      managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          ID: {manager.id} - Name: {manager.f_name} {manager.l_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </div>
              )}
              {userType === 'admin' && (
              <div>
                <Form.Group controlId="formManaged">
                  <Form.Label>Project Manager</Form.Label>
                  <Form.Control as="select" name="project_manager" value={form.project_manager} onChange={handleChange}>
                    <option value="">Select Project Manager</option>
                    {managers &&
                      Array.isArray(managers) &&
                      managers.map((manager) => (
                        <option key={manager.id} value={manager.f_name}>
                          ID: {manager.id} - Name: {manager.f_name} {manager.l_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </div>
              )}
              {userType === 'admin' && (
              <div>
                <Form.Group controlId="formManaged">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control as="select" name="project_name" value={form.project_name} onChange={handleChange}>
                    <option value="">Select Project</option>
                    {projects &&
                      Array.isArray(projects) &&
                      projects.map((project) => (
                        <option key={project.id} value={project.project_name}>
                          ID: {project.id} - Name: {project.project_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </div>
              )}
            </div>
            {userType === 'admin' && (
            <Form.Group controlId="formTaskDeadline">
              <Form.Label>Task Limit</Form.Label>
              <Form.Control type="text" name="task_deadline" value={form.task_deadline} onChange={handleChange} />
            </Form.Group>
            )}
            {userType === 'admin' && (
            <Form.Group controlId="avatar_image">
              <Form.Label style={{ color: 'red' }}>Avatar File Attachment</Form.Label>
              {form.avatarFiles && form.avatarFiles.length > 0 ? (
                <div>
                  <a href={`${backendUrl}/tasks/${editingTaskId}/download_avatar`} download>
                    Download File
                  </a>
                  <div>{form.avatarFiles[0].name}</div>
                </div>
              ) : (
                <div {...getAvatarRootProps()} className="border-2 border-dashed border-gray-300 p-5">
                  <input {...getAvatarInputProps()} />
                  <p>Drag and drop files here or click to browse</p>
                  <Button variant="secondary" size="sm">
                    Attach File
                  </Button>
                </div>
              )}
            </Form.Group>
            )}
            {useType === 'staff' && (
              <Form.Group controlId="completed_files">
              <Form.Label>Completed Files</Form.Label>
              <div>
                {form.completedFiles && form.completedFiles.length > 0 ? (
                  <div>
                    {form.completedFiles.map((file, index) => (
                      <div key={index}>{file.name}</div>
                    ))}
                  </div>
                ) : (
                  <div {...getCompletedFilesRootProps()} className="border-2 border-dashed border-gray-300 p-2">
                    <input {...getCompletedFilesInputProps()} />
                    <p>Drag and drop files here or click to browse</p>
                    <Button variant="secondary" size="sm">
                      Attach File
                    </Button>
                  </div>
                )}
              </div>
            </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="flex">
        <div className="w-1/2 pr-16">
          <div className="mb-3">
            <Form.Group controlId="formTaskDropdown">
              <Form.Label>Select Task</Form.Label>
              <Form.Control as="select" value={selectedTask} onChange={(e) => setSelectedTask(Number(e.target.value))}>
                <option value="">Select Task</option>
                {tasks &&
                  Array.isArray(tasks) &&
                  tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      Task {task.id}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <div className="mt-3">
              <Link to="#" onClick={toggleProgress} className='text-xl font-bold no-underline hover:underline'>
                Task Update
              </Link>
            </div>
            <div className="mt-3">
              <Link to="#" onClick={toggleRequests} className='text-xl font-bold no-underline hover:underline'>
                Special Request
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full">
          {selectedTask !== null && (
            <Table striped bordered hover style={{ width: '80%' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Task Name</th>
                  <th>Assigned To</th>
                  <th>Task Manager</th>
                  <th>Project Manager</th>
                  <th>Project Name</th>
                  <th>Time Limit</th>
                  <th>Tasks File Attachments</th>
                  <th>Completed Files Uploads</th>
                  {userType === 'admin' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {getSelectedTaskData() && (
                  <tr key={getSelectedTaskData().id}>
                    <td>{getSelectedTaskData().assignment_date}</td>
                    <td>{getSelectedTaskData().task_name}</td>
                    <td>{getSelectedTaskData().assigned_to}</td>
                    <td>{getSelectedTaskData().task_manager}</td>
                    <td>{getSelectedTaskData().project_manager}</td>
                    <td>{getSelectedTaskData().project_name}</td>
                    <td>{getSelectedTaskData().task_deadline}</td>
                    <td>
                      {getSelectedTaskData().avatar_image ? (
                        <div>
                          <a href={`${backendUrl}/tasks/${getSelectedTaskData().id}/download_avatar`} download>
                            Download File
                          </a>
                          <div>{getSelectedTaskData().avatar_image.name}</div>
                        </div>
                      ) : (
                        <div {...getAvatarRootProps()} className="border-2 border-dashed border-gray-300 p-5">
                          <input {...getAvatarInputProps()} />
                          <p>Drag and drop files here or click to browse</p>
                          <Button variant="secondary" size="sm">
                            Upload Avatar
                          </Button>
                        </div>
                      )}
                    </td>
                    <td>
                      {getSelectedTaskData().completed_files && getSelectedTaskData().completed_files.length > 0 ? (
                        <div>
                          {getSelectedTaskData().completed_files.map((file, index) => (
                            <div key={index}>
                              <a
                                href="#"
                                onClick={(event) => {
                                  event.preventDefault();
                                  handleDownloadCompletedFile(getSelectedTaskData().id, index);
                                }}
                              >
                                Download File
                              </a>
                              <Badge variant="success">Completed</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div {...getCompletedFilesRootProps()} className="border-2 border-dashed border-gray-300">
                          <input {...getCompletedFilesInputProps()} />
                          <p>Drag and drop files here or click to browse</p>
                          <Button variant="secondary" size="sm">
                            Attach Completed File
                          </Button>
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {userType === 'admin' ? (
                          <Button variant="primary" onClick={() => handleEdit(getSelectedTaskData())}>
                           Edit
                          </Button>
                        ) : (
                          <Button variant="primary" onClick={() => handleEdit(getSelectedTaskData())}>
                           Attach File
                          </Button>
                        )}
                        {userType === 'admin' && (
                          <Button variant="danger" onClick={() => deleteTask(getSelectedTaskData().id)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>
      {showRequests && (
        <div className="sticky top-0 h-full">
            <Request
              userType={userType}
              useType={useType}
              managers={managers}
              requests={requests}
              deleteRequest={deleteRequest}
              updateRequest={updateRequest}
              handleUpdateRequest={handleUpdateRequest}
              loggedInStaff={loggedInStaff}
            />
        </div>
      )}
      {showProgress && (
        <div className="sticky top-0 h-full">
            <TaskProgress
              userType={userType}
              useType={useType}
              managers={managers}
              progresses={progresses}
              deleteProgress={deleteProgress}
              updateProgress={updateProgress}
              handleUpdateProgress={handleUpdateProgress}
              loggedInStaff={loggedInStaff}
            />
        </div>
      )}
    </div>
  );
};

export default Tasks;