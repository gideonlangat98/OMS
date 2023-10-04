import React, { useState, useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import TaskProgress from './TaskProgress';
import Request from './Request';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { OmsContext } from '../components/auth/AuthContext';
import { randomColor } from 'randomcolor';

const Tasks = ({ staffs, managers, progresses, progresId, unreadProgressCount, setUnreadProgressCount, loggedInStaff, updateProgress, useType, deleteProgress, handleUpdateProgress, projects, requests, deleteRequest, updateRequest, handleUpdateRequest, deleteTask, userType, tasks, setTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [form, setForm] = useState({
    assignment_date: '',
    completion_date: '',
    task_name: '',
    assigned_to: '',
    task_manager: '',
    project_manager: '',
    project_name: '',
    task_deadline: '',
    avatarFiles: [],
    completedFiles: [],
    isComplete: 'Not Started',
  });

  const { backendUrl } = useContext(OmsContext);

  const [selectedTask, setSelectedTask] = useState(null);

  const [showRequests, setShowRequests] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const [showTasksTable, setShowTasksTable] = useState(true)

  const toggleRequests = () => {
    setShowRequests(!showRequests);
    setShowTasksTable(false);
    setShowProgress(false);
  };

  const toggleProgress = async () => {
    setShowProgress(!showProgress);
    setShowTasksTable(false);
    setShowRequests(false);
    setUnreadProgressCount(0);



    if (userType === 'admin') {
      try {
        const token = localStorage.getItem('token');
        const patchUrl = `${backendUrl}/progresses/${progresId}/update_seen`;
        await axios.put(patchUrl, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

      } catch (error) {
        console.error('Error updating progress seen status:', error);
      }
    }
  };  
  
  const [taskColors] = useState(() => {
    const initialColors = {}; // Store colors for each task
    tasks.forEach((task) => {
      initialColors[task.id] = randomColor(); // Generate a random color for each task
    });
    return initialColors; // Set the initial colors
  });
  
  const handleTaskCardClick = (taskId) => {
    setSelectedTask(taskId); // Set the selected task
    setShowTasksTable(true); // Show the task table when a task card is clicked
    setShowProgress(false); // Hide the progress table
    setShowRequests(false); // Hide the requests table
  };
  

  const getSelectedTaskData = () => {
    if (!selectedTask) return null;
    return tasks.find((task) => task.id === selectedTask);
  };

  useEffect(() => {
    if (tasks && tasks.length > 0) {
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
      formData.append('completion_date', form.completion_date);
      formData.append('task_name', form.task_name);
      formData.append('assigned_to', form.assigned_to);
      formData.append('task_manager', form.task_manager);
      formData.append('project_manager', form.project_manager);
      formData.append('project_name', form.project_name);
      formData.append('task_deadline', form.task_deadline);
  
      // Only add isComplete if the user is not an admin
      if (userType !== 'admin') {
        formData.append('isComplete', form.isComplete);
      }
  
      form.avatarFiles.forEach((file) => {
        formData.append('avatar_image', file);
      });
  
      form.completedFiles.forEach((file) => {
        formData.append('completed_files[]', file);
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
  
      if (!editingTaskId) {
        setForm((prevData) => ({
          ...prevData,
          status: 'Not Started',
        }));
      }
  
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
        completion_date: '',
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
  
  const handleTaskStatusChange = (taskId) => {
    // Find the task in the tasks array
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      // Define the possible status values: 'Not Started', 'In Progress', 'Complete'
      const statusValues = ['Not Started', 'In Progress', 'Done'];

      // Find the current status index
      const currentStatusIndex = statusValues.indexOf(taskToUpdate.isComplete);

      // Calculate the next status index (cycling through the values)
      const nextStatusIndex = (currentStatusIndex + 1) % statusValues.length;

      // Update the status for the specific task
      taskToUpdate.isComplete = statusValues[nextStatusIndex];

      // Update the tasks array with the updated task
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === taskId ? taskToUpdate : task
        );
        return updatedTasks;
      });

      // Store the updated status in local storage
      localStorage.setItem(`taskStatus_${taskId}`, taskToUpdate.isComplete);
    }
  };

  useEffect(() => {
    // When the component mounts, initialize the selected task
    if (tasks && tasks.length > 0) {
      setSelectedTask(tasks[0].id);
    }

    // Retrieve task statuses from local storage and update the tasks array
    tasks.forEach((task) => {
      const storedStatus = localStorage.getItem(`taskStatus_${task.id}`);
      if (storedStatus) {
        task.isComplete = storedStatus;
      }
    });
  }, [tasks]);

  const handleEdit = (task) => {
    setForm((prevForm) => ({
      ...prevForm,
      assignment_date: task.assignment_date || '',
      completion_date: task.completion_date || '',
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

  useEffect(() => {
    const assignmentDate = new Date(form.assignment_date);
    const completionDate = new Date(form.completion_date);

    if (!isNaN(assignmentDate) && !isNaN(completionDate)) {
      const timeDifference = completionDate - assignmentDate;
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      setForm((prevData) => ({
        ...prevData,
        task_deadline: daysDifference.toString(),
      }));
    }
  }, [form.assignment_date, form.completion_date]);

  return (
    <div style={{overflow: "hidden"}} className="container bg-white rounded-lg shadow-lg p-6 pr-6">
      <div className="flex justify-between mb-5">
        <div className="text-center text-green">
          <h3>Tasks</h3>
        </div>
        <div className="grid grid-cols-6 gap-2 mt-4">
            {tasks.map((task) => (
             <div
              key={task.id}
              onClick={() => handleTaskCardClick(task.id)}
              className={`p-3 border rounded-lg cursor-pointer`}
              style={{
                backgroundColor: taskColors[task.id],
              }}
            >
              Task {task.id}
            </div>
            ))}

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
                  completion_Date: '',
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
              <Form.Label className='font-bold'>Assigned Date</Form.Label>
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
              <Form.Group controlId="formDateTo">
              <Form.Label className='font-bold'>Completion Date</Form.Label>
              <Form.Control
                type='date'
                name='completion_date'
                value={form.completion_date}
                onChange={handleChange}
              />
             </Form.Group>
            </div>
            )}
            {userType === 'admin' && (
              <div>
                <Form.Group controlId="formTaskname">
                  <Form.Label className='font-bold'>Task Name</Form.Label>
                  <Form.Control type="text" name="task_name" value={form.task_name} onChange={handleChange} />
                </Form.Group>
              </div>
              )}

              {userType === 'admin' && (
              <div>
                <Form.Group controlId="formAssigned">
                  <Form.Label className='font-bold'>Assigned To</Form.Label>
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
            <div className="grid grid-cols-2 gap-4 mt-2">
            {userType === 'admin' && (
              <div>
                <Form.Group controlId="formManaged">
                  <Form.Label className='font-bold'>Task Manager</Form.Label>
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
                  <Form.Label className='font-bold'>Project Manager</Form.Label>
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
                  <Form.Label className='font-bold'>Project Name</Form.Label>
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
              {userType === 'admin' && (
              <div className='mt-2'>
               <Form.Group controlId="formTaskDeadline">
                 <Form.Label className='font-bold'>No. Of Days</Form.Label>
                 <Form.Control type="text" name="task_deadline" value={form.task_deadline} onChange={handleChange} />
               </Form.Group>
              </div>
            )}
            
            {userType === 'staff' && (
            <div>
              <Form.Group controlId="formIsComplete">
                <Form.Label className='font-bold'>Task Status</Form.Label>
                <div>
                  <Button variant={form.isComplete === 'Not Started' ? 'danger' : 'secondary'}
                   onClick={() => handleChange({ target: { name: 'isComplete', value: 'Not Started' } })}
                  >
                    Not Started
                  </Button>
                  <div className='text-white'>
                    <Button classname='text-white' variant={form.isComplete === 'In Progress' ? 'primary' : 'secondary'}
                     onClick={() => handleChange({ target: { name: 'isComplete', value: 'In Progress' } })}
                    >
                      In Progress
                    </Button>
                  </div>
                  <Button variant={form.isComplete === 'Completed Task' ? 'primary' : 'secondary'}
                   onClick={() => handleChange({ target: { name: 'isComplete', value: 'Completed Task' } })}
                   >
                    Completed Task
                  </Button>
                </div>
              </Form.Group>
              </div>
              )}

            </div>
            {userType === 'admin' && (
              <div className='mt-2'>
                <Form.Group controlId="avatar_image">
                 <Form.Label className='font-bold' style={{ color: 'red' }}>Avatar File Attachment</Form.Label>
                {form.avatarFiles && form.avatarFiles.length > 0 ? (
                <div>
                  <a href={`${backendUrl}/tasks/${editingTaskId}/download_avatar`} download>
                    Download File
                  </a>
                  <div>{form.avatarFiles[0].name}</div>
                </div>
              ) : (
                <div {...getAvatarRootProps()} className="border-2 border-dashed border-gray-300 p-5 text-center">
                  <input {...getAvatarInputProps()} />
                  <p>Drag and drop files here or click to browse</p>
                  <Button variant="secondary" size="sm">
                    Attach File
                  </Button>
                </div>
             
              )}
            </Form.Group>
             </div>
            )}
            {useType === 'staff' && (
              <Form.Group controlId="completed_files">
              <Form.Label className='font-bold'>Completed Files</Form.Label>
              <div>
                {form.completedFiles && form.completedFiles.length > 0 ? (
                  <div>
                    {form.completedFiles.map((file, index) => (
                      <div key={index}>{file.name}</div>
                    ))}
                  </div>
                ) : (
                  <div {...getCompletedFilesRootProps()} className="border-2 border-dashed border-gray-300 p-2 text-center">
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
           <div className="text-center">
            <Button variant="primary" type="submit" className="mt-4 px-4 py-2">
              Submit
            </Button>
          </div>
          </Form>
        </Modal.Body>
      </Modal>
      <div className='flex'>
      <div className="w-1/4 pr-4">
          <div className="mb-3">
            <h4>Menu</h4>
            <div className="mt-8">
              <Link to="#" onClick={toggleProgress} className='text-xl font-bold no-underline hover:underline'>
                <span style={{ position: 'relative' }}>
                Task
              <span className="absolute transform -translate-y-1/2 bg-red-500 text-white px-1 py-0.3 mr-10 rounded-full">
                {unreadProgressCount}
              </span>
              </span>
              Progress Update
              </Link>
            </div>

            <div className="mt-3">
              <Link to="#" onClick={toggleRequests} className='text-xl font-bold no-underline hover:underline'>
                Special Request
              </Link>
            </div>
          </div>
        </div>
        <div className={`w-full ${showTasksTable ? '' : 'hidden'}`}>
          {selectedTask !== null && (
            <Table striped bordered hover style={{ width: '60%' }}>
              <thead>
                <tr>
                  <th>Assigned Date</th>
                  <th>End Date</th>
                  <th>Task Name</th>
                  <th>Assigned To</th>
                  <th>Task Manager</th>
                  <th>Project Manager</th>
                  <th>Project Name</th>
                  <th>Days Given</th>
                  <th>Tasks Files</th>
                  <th>Completed Files</th>
                  <th>Status</th>
                  <th>File Uploads</th>
                  {userType === 'admin' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {getSelectedTaskData() && (
                  <tr key={getSelectedTaskData().id}>
                    <td>{getSelectedTaskData().assignment_date}</td>
                    <td>{getSelectedTaskData().completion_date}</td>
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
                      {getSelectedTaskData() && (
                      <Button variant={
                        getSelectedTaskData().isComplete === 'Not Started'
                        ? 'danger' : getSelectedTaskData().isComplete === 'In Progress'
                        ? 'warning'
                        : 'success'
                      }
                      onClick={() => {
                        if (useType === 'staff') {
                          handleTaskStatusChange(getSelectedTaskData().id);
                        }
                      }}
                      disabled={userType === 'admin'} // Disable the button for admins
                      >
                        {getSelectedTaskData().isComplete}
                        </Button>
                        )}
                    </td>
                    <td>
                      <div className='mb-2'>
                        {userType === 'admin' ? (
                          <Button className='mb-2' variant="primary" onClick={() => handleEdit(getSelectedTaskData())}>
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
        <div className={`w-full ${showProgress ? '' : 'hidden'}`}>
          {showProgress && (
            <TaskProgress
              userType={userType}
              useType={useType}
              managers={managers}
              progresses={progresses}
              deleteProgress={deleteProgress}
              updateProgress={updateProgress}
              handleUpdateProgress={handleUpdateProgress}
              loggedInStaff={loggedInStaff}
              tasks={tasks}
              unreadProgressCount={unreadProgressCount}
              setUnreadProgressCount={setUnreadProgressCount}
              progresId={progresId}
            />
          )}
        </div>
        <div className={`w-full ${showRequests ? '' : 'hidden'}`}>
          {showRequests && (
            <Request
              tasks={tasks}
              userType={userType}
              useType={useType}
              managers={managers}
              requests={requests}
              deleteRequest={deleteRequest}
              updateRequest={updateRequest}
              handleUpdateRequest={handleUpdateRequest}
              loggedInStaff={loggedInStaff}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;