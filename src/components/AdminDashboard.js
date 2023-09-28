import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Tasks from '../pages/Tasks';
import Staff from '../pages/Staff';
import Projects from '../pages/Projects';
import LeaveRequest from '../pages/LeaveRequest';
import LeaveForm from '../pages/LeaveForm';
import { LeaveType } from '../pages/LeaveType';
import TimeSheets from '../pages/TimeSheets';
// import CalculationHistory from '../pages/CalculationHistory';
import LeaveHistory from '../pages/LeaveHistory';
import Client from '../pages/Client';
import Managers from '../pages/Managers';
import AdminLayout from './AdminLayout';
import LeaveCalculation from '../pages/LeaveCalculation';
import NewsArticle from '../pages/NewsArticle';
import AdminChat from '../pages/AdminChat';
import Dashboard from '../pages/Dashboard';
import { OmsContext } from './auth/AuthContext';
import StartTimesheet from '../pages/StartTimesheet';
import Meeting from '../pages/Meeting';
import TaskProgress from '../pages/TaskProgress';
import Request from '../pages/Request';
import CheckStatus from '../pages/CheckStatus';
import TasksReport from '../pages/TasksReport';
import Navbar from './Navbar';
import axios from 'axios';

function AdminDashboard({ staffs, setLoggedInManager, setIsCheckedIn, setIsCheckedOut, lastSeen, isLoggedIn, loggedInSeen, setLoggedInStaff, handleUpdateStaff, useType, isAdmin, company_articles, setCompany_Articles, deleteArticle, updateArticle, handleUpdateArticle, userType, updateLoggedIn, deleteStaff, updateStaff, leave_calculations, handleUpdateCalculation, deleteCalculations, updateCalculation, setLeave_calculations }) {
  const [timesheets, setTimesheets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [forms, setForms] = useState([]);
  const [clients, setClients] = useState([]);
  const [events, setEvents] = useState([]);
  const [leave_types, setLeave_types] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [content, setContent] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [check_in_outs, setCheckInOuts] = useState([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const {backendUrl} = useContext(OmsContext);

  useEffect(() => {
    fetchTimesheets();
    fetchProjects();
    fetchForms();
    fetchClients();
    fetchReports();
    fetchManagers();
    fetchProgresses();
    fetchRequests();
    fetchCheckStatus();
    fetchEvents();
  }, []);

  
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  async function fetchEvents() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/events`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setEvents(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Perform update operation on staffs
  const updateEvent = (updatedEvent) => {
    const updatedEvents = events.map((event) => {
      if(event.id === updatedEvent.id) {
        return updatedEvent;
      }
      return event;
    })
    setEvents(updatedEvents)
  }

  // Perform delete operation on staffs
  async function deleteEvent(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  const handleUpdateEvent = (newEvent) => {
    setEvents([...events, newEvent])
  }

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

 
  const handleReceivedMessage = (newMessage) => {
    if (newMessage.sender_type === 'staff') {
      setReceivedMessages([...receivedMessages, newMessage]);
      // Increment the unread message count
      setUnreadMessageCount(unreadMessageCount + 1);
    }
  };  
  
    // Fetch received messages
  const fetchReceivedMessages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/messages/received_messages?staff_id=${selectedStaffId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const newReceivedMessages = response.data;
  
      // Update received messages and increment unread message count
      setReceivedMessages(newReceivedMessages);
      setUnreadMessageCount(unreadMessageCount + newReceivedMessages.length);
    } catch (error) {
      console.error('Error fetching received messages:', error);
    }
  };

  // Fetch sent messages
  const fetchSentMessages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/messages/sent_messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: { staff_id: selectedStaffId },
      });

      setSentMessages(response.data);
    } catch (error) {
      console.error('Error fetching sent messages:', error);
    }
  };

  const updateMessage = async (id, newContent) => {
    try {
      const response = await axios.put(
        `${backendUrl}/messages/${id}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Update both sent and received messages state
      const updatedReceivedMessages = receivedMessages.map((message) =>
        message.id === id ? { ...message, content: response.data.content } : message
      );

      const updatedSentMessages = sentMessages.map((message) =>
        message.id === id ? { ...message, content: response.data.content } : message
      );

      setReceivedMessages(updatedReceivedMessages);
      setSentMessages(updatedSentMessages);
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${backendUrl}/messages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Update both sent and received messages state
      const updatedReceivedMessages = receivedMessages.filter((message) => message.id !== id);
      const updatedSentMessages = sentMessages.filter((message) => message.id !== id);

      setReceivedMessages(updatedReceivedMessages);
      setSentMessages(updatedSentMessages);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    if (selectedStaffId) {
      fetchReceivedMessages();
      fetchSentMessages();
    }
  }, [selectedStaffId]);

  //fetch CheckInStatus
  useEffect(() => {
    const storedCheckInOuts = localStorage.getItem('check_in_outs');
    if (storedCheckInOuts) {
      setCheckInOuts(JSON.parse(storedCheckInOuts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('check_in_outs', JSON.stringify(check_in_outs));
  }, [check_in_outs]);

  async function fetchCheckStatus() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/check_in_outs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setCheckInOuts(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteStatus(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/check_in_outs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCheckInOuts(check_in_outs.filter(check_in_out => check_in_out.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  useEffect(() => {
    const storedManagers = localStorage.getItem('managers');
    if (storedManagers) {
      setManagers(JSON.parse(storedManagers));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('managers', JSON.stringify(managers));
  }, [managers]);

  async function fetchManagers() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/managers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setManagers(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Perform update operation on staffs
  const updateManager = (updatedManager) => {
    const updatedManagers = managers.map((manager) => {
      if(manager.id === updatedManager.id) {
        return updatedManager;
      }
      return manager;
    })
    setManagers(updatedManagers)
  }

  // Perform delete operation on staffs
  async function deleteManagers(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/managers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setManagers(managers.filter(manager => manager.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  function handleUpdateManager(newManager) {
    setManagers([...managers, newManager])
  }

  //fetch reports
  useEffect(() => {
    const storedReports = localStorage.getItem('leave_types');
    if (storedReports) {
      setLeave_types(JSON.parse(storedReports));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('leave_types', JSON.stringify(leave_types));
  }, [leave_types]);


  async function fetchReports() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/leave_types`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setLeave_types(data);
    } catch (error) {
      console.log(error);
    }
  }

  const updateLeave = (updatedLeave) => {
    const updatedLeaves = leave_types.map((leave_type) => {
      if (leave_type.id === updatedLeave.id) {
        return updatedLeave;
      }
      return leave_type;
    });
    setLeave_types(updatedLeaves);
  };

  // Perform delete operation on projects
  async function deleteLeave(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/leave_types/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeave_types(leave_types.filter(leave_type => leave_type.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  function handleUpdateLeave(newReport) {
    setLeave_types([...leave_types, newReport]);
  }

  //fetch clients

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

  const updateClient = (updatedClient) => {
    const updatedClients = clients.map((client) => {
      if (client.id === updatedClient.id) {
        return updatedClient;
      }
      return client;
    });
    setClients(updatedClients);
  };

  async function deleteClients(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClients(clients.filter(client => client.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }
  function handleUpdateClient(newClient) {
    setClients([...clients, newClient]);
  }

  //fetch timesheets

  useEffect(() => {
    const storedTimesheets = localStorage.getItem('timesheets');
    if (storedTimesheets) {
      setTimesheets(JSON.parse(storedTimesheets));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('timesheets', JSON.stringify(timesheets));
  }, [timesheets]);


  async function fetchTimesheets() {
    try {
      const token = localStorage.getItem('token'); // Retrieve the staff ID from local storage
      const staffId = localStorage.getItem('staffId');
      const response = await axios.get(`${backendUrl}/timesheets?staff_id=${staffId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setTimesheets(data);
    } catch (error) {
      console.log(error);
    }
  }


  async function updateSheet(id, newData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${backendUrl}/timesheets/${id}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setTimesheets(data);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  async function deleteData(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/timesheets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTimesheets(timesheets.filter(timesheet => timesheet.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }
  function handleUpdateSheet(newSheet) {
    setTimesheets([...timesheets, newSheet]);
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

  // function handleUpdateTask(newTask) {
  //   setTasks([...tasks, newTask]);
  // }

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

  // Fetch forms
  useEffect(() => {
    const storedForms = localStorage.getItem('forms');
    if (storedForms) {
      setForms(JSON.parse(storedForms));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('forms', JSON.stringify(forms));
  }, [forms]);

  async function fetchForms() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/forms`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setForms(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Perform update operation on forms
  async function updateForm(id, newData) {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${backendUrl}/forms/${id}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedForms = forms.map((form) => {
        if (form.id === id) {
          return { ...form, ...newData };
        }
        return form;
      });
      setForms(updatedForms);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  
  async function deleteForms(id) {
    try {
      const token = localStorage.getItem('token'); // Replace with your token

      await axios.delete(`${backendUrl}/forms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });
      setForms(forms.filter((form) => form.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  function handleUpdateForm(newForm) {
    setForms([...forms, newForm])
  }


  const updateAvailableDays = (typeOfLeave, usedDays) => {
    // Find the leave calculation for the specific leave type
    const leaveCalculation = leave_calculations.find(calculation => calculation.type_of_leave === typeOfLeave);
  
    if (leaveCalculation) {
      const updatedCalculation = {
        ...leaveCalculation,
        used_days: leaveCalculation.used_days + usedDays,
        available_days: leaveCalculation.total_days - (leaveCalculation.used_days + usedDays)
      };
  
      // Update the leave calculation in the state
      const updatedCalculations = leave_calculations.map(calculation =>
        calculation.type_of_leave === typeOfLeave ? updatedCalculation : calculation
      );
  
      // Call the function to update leave_calculations state
      updateCalculation(updatedCalculations);
    }
  };

  // Fetch the stored route from localStorage on page load
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
      <Navbar updateLoggedIn={updateLoggedIn} setIsCheckedIn={setIsCheckedIn} setIsCheckedOut={setIsCheckedOut} userType={userType} setLoggedInStaff={setLoggedInStaff} setLoggedInManager={setLoggedInManager} />
      <AdminLayout updateLoggedIn={updateLoggedIn} unreadMessageCount={unreadMessageCount} >
        <Routes>
          <Route path="/" element={<Navigate to="/admindashboard/dashboard" />} />
          <Route
            path="/tasks"
            element={<Tasks tasks={tasks} requests={requests} updateRequest={updateRequest} deleteRequest={deleteRequest} handleUpdateRequest={handleUpdateRequest} progresses={progresses} updateProgress={updateProgress} deleteProgress={deleteProgress} handleUpdateProgress={handleUpdateProgress} setTasks={setTasks} projects={projects} userType={userType} stafId={localStorage.getItem('stafId')} staffs={staffs} managers={managers} deleteTask={handleDelete} />}
          />
          <Route
            path="/task-report"
            element={<TasksReport deleteTask={handleDelete} tasks={tasks} />}
          />
           <Route
            path="/dashboard"
            element={<Dashboard 
              handleUpdateStaff={handleUpdateStaff}
              updateStaff={updateStaff}
              deleteStaff={deleteStaff}
              managers={managers}
              staffs={staffs}
              deleteManager={deleteManagers}
              handleUpdateManager={handleUpdateManager}
              updateManager={updateManager}
              tasks={tasks}
              deleteTask={handleDelete}
              clients={clients} 
              onUpdate={updateClient} 
              deleteClients={deleteClients} 
              onUpdateClient={handleUpdateClient}
              projects={projects}
              handleUpdateProject={handleUpdateProject}
              updateProject={handleUpdateProjects}
              deleteProject={deleteProjects}
              timesheets={timesheets}
              updateSheet={updateSheet}
              deleteSheet={deleteData}
              handleUpdateSheet={handleUpdateSheet}
              leave_types={leave_types}
              updateLeave={updateLeave}
              handleUpdateLeave={handleUpdateLeave}
              deleteLeave={deleteLeave}
              forms={forms}
              leave_calculations={leave_calculations}
              content={content} 
              setContent={setContent} 
              selectedStaffId={selectedStaffId} 
              setSelectedStaffId={setSelectedStaffId} 
              deleteMessage={deleteMessage} 
              updateMessage={updateMessage}
              receivedMessages={receivedMessages}
              setReceivedMessages={setReceivedMessages}
              sentMessages={sentMessages}
              setSentMessages={setSentMessages}
              isAdmin={isAdmin}
              userType={userType}
               />}
          />
          
          <Route
            path="/news"
            element={<NewsArticle company_articles={company_articles} setCompany_Articles={setCompany_Articles} updateArticle={updateArticle} deleteArticle={deleteArticle} handleUpdateArticle={handleUpdateArticle} />}
          />

          <Route
            path="/requests"
            element={
              <Request
                tasks={tasks}
                userType={userType}
                requests={requests}
                managers={managers}
                updateRequest={updateRequest}
                deleteRequest={deleteRequest}
                handleUpdateRequest={handleUpdateRequest}
              />
            }
          />
          <Route
            path="/progresses"
            element={
              <TaskProgress
                tasks={tasks}
                userType={useType}
                progresses={progresses}
                updateProgress={updateProgress}
                deleteProgress={deleteProgress}
                handleUpdateProgress={handleUpdateProgress}
              />
            }
          />

          <Route
            path="/chat"
            element={<AdminChat staffs={staffs} isAdmin={isAdmin} receivedMessages={receivedMessages} setReceivedMessages={setReceivedMessages} sentMessages={sentMessages} setSentMessages={setSentMessages} content={content} setContent={setContent} selectedStaffId={selectedStaffId} setSelectedStaffId={setSelectedStaffId} deleteMessage={deleteMessage} updateMessage={updateMessage} />}
          />

          <Route
            path="/meeting"
            element={<Meeting staffs={staffs} events={events} deleteEvent={deleteEvent} updateEvent={updateEvent} handleUpdateEvent={handleUpdateEvent} />}
          />

          <Route
            path="/check-status"
            element={<CheckStatus check_in_outs={check_in_outs} deleteStatus={deleteStatus} setCheckInOuts={setCheckInOuts} />}
          />

          <Route
            path="/client"
            element={<Client clients={clients} onUpdate={updateClient} deleteClients={deleteClients} onUpdateClient={handleUpdateClient} />}
          />
          <Route
            path="/staff"
            element={<Staff staffs={staffs}  lastSeen={lastSeen} isLoggedIn={isLoggedIn} loggedInSeen={loggedInSeen} managers={managers} updateStaff={updateStaff} deleteStaff={deleteStaff} handleUpdateStaff={handleUpdateStaff} />}
          />
          <Route
            path="/calculation"
            element={<LeaveCalculation forms={forms} leave_types={leave_types} leave_calculations={leave_calculations} staffs={staffs} setLeave_calculations={setLeave_calculations} updateCalculation={updateCalculation} deleteCalculations={deleteCalculations} handleUpdateCalculation={handleUpdateCalculation} />}
          />
          <Route
            path="/manager"
            element={<Managers managers={managers} updateManager={updateManager} deleteManagers={deleteManagers} handleUpdateManager={handleUpdateManager} />}
          />
          <Route
            path="/projects"
            element={<Projects projects={projects} managers={managers} userType={userType} clients={clients} handleUpdateProject={handleUpdateProject} deleteProjects={deleteProjects} handleUpdateProjects={handleUpdateProjects} />}
          />
          <Route
            path="/leave-form"
            element={<LeaveForm staffs={staffs} onUpdateForm={handleUpdateForm} />}
          />
          <Route
            path="/leave-history"
            element={<LeaveHistory userType={userType} leave_calculations={leave_calculations} forms={forms} deleteForms={deleteForms} />}
          />
          {/* <Route
            path="/calculation-hist"
            element={<CalculationHistory leaveCalculations={leave_calculations} deleteCalculations={deleteCalculations} />}
          /> */}
          <Route
            path="/leave-request"
            element={<LeaveRequest leave_calculations={leave_calculations} setLeaveCalculations={setLeave_calculations} leave_types={leave_types} forms={forms} updateAvailableDays={updateAvailableDays} setForms={setForms} updateForm={updateForm} />}
          />
          <Route
            path="/leave-type"
            element={<LeaveType staffs={staffs} leave_types={leave_types} updateLeave={updateLeave} onUpdateLeave={handleUpdateLeave} deleteLeave={deleteLeave} />}
          />
          <Route
            path="/timesheets"
            element={<TimeSheets timesheets={timesheets} tasks={tasks} updateSheet={updateSheet} deleteData={deleteData} onUpdateSheet={handleUpdateSheet} />}
          />
          <Route
            path="/start-timesheet"
            element={
              <StartTimesheet
                managers={managers}
                tasks={tasks}
                timesheets={timesheets}
                updateSheet={updateSheet}
                deleteData={deleteData}
                onUpdateSheet={handleUpdateSheet}
                staffId={localStorage.getItem('staffId')}
              />
            }
          />
        </Routes>
        
      </AdminLayout>
    </div>
  );
}

export default AdminDashboard;