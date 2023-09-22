import React, { useState, useEffect, useContext } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Projects from '../pages/Projects';
import { OmsContext } from './auth/AuthContext';
import ManagerLayout from './ManagerLayout';
import ManagerCard from '../pages/ManagerCard';
import Tasks from '../pages/Tasks';
import TasksReport from '../pages/TasksReport';
import Navbar from './Navbar';
import axios from 'axios';

const ManagerDashboard = ({usingType, userType, updateLoggedIn, setLoggedInStaff, setLoggedInManager, staffs, managers, loggedInManager}) => {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [requests, setRequests] = useState([]);
    const [progresses, setProgresses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const { backendUrl } = useContext(OmsContext);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchProjects();
        fetchClients();
        fetchProgresses();
        fetchRequests();
    })

    useEffect(() => {
        const storedProgresses = localStorage.getItem('progresses');
        if (storedProgresses) {
          setProgresses(JSON.parse(storedProgresses));
        }
      }, []);
    
    
      useEffect(() => {
        localStorage.setItem('progresses', JSON.stringify(progresses));
      }, [progresses]);
    
      async function fetchProgresses() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${backendUrl}/progresses`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = response.data;
          setProgresses(data);
        } catch (error) {
          console.log(error);
        }
      }
    
      // Perform update operation on staffs
      async function updateProgress(id, newData) {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`${backendUrl}/progresses/${id}`, newData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const updatedProgresses = progresses.map((progress) => {
            if (progress.id === id) {
              return { ...progress, ...newData };
            }
            return progress;
          });
          setProgresses(updatedProgresses);
        } catch (error) {
          console.error('Error updating data:', error);
        }
      }
    
      // Perform delete operation on staffs
      async function deleteProgress(id) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${backendUrl}/progresses/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setProgresses(progresses.filter(progress => progress.id !== id));
        } catch (error) {
          console.error('Error Deleting data:', error);
        }
      }
    
      function handleUpdateProgress(newProgress) {
        setProgresses([...progresses, newProgress])
      }
    
      //Fetch Requests
    
      useEffect(() => {
        const storedRequests = localStorage.getItem('requests');
        if (storedRequests) {
          setRequests(JSON.parse(storedRequests));
        }
      }, []);
    
    
      useEffect(() => {
        localStorage.setItem('requests', JSON.stringify(requests));
      }, [requests]);
    
      async function fetchRequests() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${backendUrl}/requests`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = response.data;
          setRequests(data);
        } catch (error) {
          console.log(error);
        }
      }
    
      // Perform update operation on staffs
      async function updateRequest(id, newData) {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`${backendUrl}/requests/${id}`, newData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const updatedRequests = requests.map((request) => {
            if (request.id === id) {
              return { ...request, ...newData };
            }
            return request;
          });
          setRequests(updatedRequests);
        } catch (error) {
          console.error('Error updating data:', error);
        }
      }
    
      // Perform delete operation on staffs
      async function deleteRequest(id) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${backendUrl}/requests/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setRequests(requests.filter(request => request.id !== id));
        } catch (error) {
          console.error('Error Deleting data:', error);
        }
      }
    
      function handleUpdateRequest(newRequest) {
        setRequests([...requests, newRequest])
      }

    // Fetch projects
  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  async function fetchProjects() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Perform update operation on projects
  const handleUpdateProject = (updatedProject) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === updatedProject.id) {
        return updatedProject;
      }
      return project;
    });
    setProjects(updatedProjects);
  };

  // Perform delete operation on projects
  async function deleteProjects(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  function handleUpdateProjects(newProject) {
    setProjects([...projects, newProject]);
  }

  useEffect(() => {
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);


  async function fetchClients() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/clients`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setClients(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch tasks
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Fetch tasks data from the backend when the component mounts
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/tasks/admin_all_tasks`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks(); // Call the fetchTasks function inside useEffect to fetch tasks data on component mount
  }, []);

  const handleDelete = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${backendUrl}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      console.log('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  useEffect(() => {
    const storedRoute = localStorage.getItem('currentRoute');
    if (storedRoute) {
      navigate(storedRoute); // Navigate to the stored route
    }
  }, []);

  // Store the current route in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentRoute', location.pathname);
  }, [location.pathname]);

  return (
    <div>
        <Navbar updateLoggedIn={updateLoggedIn}  setLoggedInStaff={setLoggedInStaff} setLoggedInManager={setLoggedInManager} loggedInManager={loggedInManager} usingType={usingType} />
        <ManagerLayout>
        <Routes>
            <Route path="/" element={<Navigate to="/managerdashboard/managerdash" />} />
            <Route
              path="/projects"
              element={<Projects projects={projects} managers={managers} usingType={usingType} clients={clients} handleUpdateProject={handleUpdateProject} deleteProjects={deleteProjects} handleUpdateProjects={handleUpdateProjects} />}
            />
            <Route
              path="/tasks"
              element={<Tasks tasks={tasks} requests={requests} updateRequest={updateRequest} deleteRequest={deleteRequest} handleUpdateRequest={handleUpdateRequest} progresses={progresses} updateProgress={updateProgress} deleteProgress={deleteProgress} handleUpdateProgress={handleUpdateProgress} setTasks={setTasks} projects={projects} userType={userType} stafId={localStorage.getItem('stafId')} staffs={staffs} managers={managers} deleteTask={handleDelete} />}
            />
            <Route
              path="/task-report"
              element={<TasksReport deleteTask={handleDelete} tasks={tasks} />}
            />
            <Route
              path="/managerdash"
              element={<ManagerCard 
                projects={projects}
                handleUpdateProject={handleUpdateProject}
                deleteProject={deleteProjects}
                updateProject={handleUpdateProjects}
                usingType={usingType}
                setLoggedInManager={setLoggedInManager}
                tasks={tasks}
                deleteTask={handleDelete}
              /> }
            />

       </Routes>
       </ManagerLayout>
    </div>
  )
}

export default ManagerDashboard
