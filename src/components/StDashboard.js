import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Tasks from '../pages/Tasks';
import Projects from '../pages/Projects';
import LeaveRequest from '../pages/LeaveRequest';
import LeaveForm from '../pages/LeaveForm';
import { LeaveType } from '../pages/LeaveType';
import ProfilePage from '../pages/ProfilePage';
import LeaveCalculation from '../pages/LeaveCalculation';
import LeaveHistory from '../pages/LeaveHistory';
import CalculationHistory from '../pages/CalculationHistory';
import Layout from './Layout';
import { OmsContext } from './auth/AuthContext';
import CompanyNews from '../pages/CompanyNews';
import StartTimesheet from '../pages/StartTimesheet';
import StaffDashboard from '../pages/StaffDashboard';
import StaffChat from '../pages/StaffChat';
import Request from '../pages/Request';
import TaskProgress from '../pages/TaskProgress';
import CheckIn from '../pages/CheckIn';
import CheckOut from '../pages/CheckOut';
import Navbar from './Navbar'
import axios from 'axios';

function StDashboard({ staffs, setStaffs, isStaff, isCheckedIn, isCheckedOut, setIsCheckedIn, setIsCheckedOut, isAdmin, setLoggedInManager, company_articles, setCompany_Articles, deleteArticle, updateArticle, handleUpdateArticle, loggedInStaffId, useType, userType, setLoggedInStaff, loggedInStaff, leave_calculations, calcId, updateLoggedIn, handleUpdateCalculation, deleteCalculations, updateCalculation }) {
  const [timesheets, setTimesheets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [forms, setForms] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [content, setContent] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [managers, setManagers] = useState([]);
  const [leave_types, setLeave_types] = useState([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadTaskCount, setUnreadTaskCount] = useState(0);
  const [readMessageIds, setReadMessageIds] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const {backendUrl} = useContext(OmsContext);

  useEffect(() => {
    fetchTimesheets();
    fetchProjects();
    fetchForms();
    fetchRequests();
    fetchProgresses();
    fetchManagers();
    fetchReports();
  }, []);

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

  // Perform update operation on Progresses
  const updateProgress = (updatedProgress) => {
    const updatedProgresses = progresses.map((progress) => {
      if(progress.id === updatedProgress.id) {
        return updatedProgress;
      }
      return progress;
    })
    setProgresses(updatedProgresses)
  }

  // Perform delete operation on Progresses
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
  const updateRequest = (updatedRequest) => {
    const updatedRequests = requests.map((request) => {
      if(request.id === updatedRequest.id) {
        return updatedRequest;
      }
      return request;
    })
    setRequests(updatedRequests)
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
     
  const fetchReceivedMessages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/messages/received_messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const newReceivedMessages = response.data;
  
      // Filter the received messages to only include those from admin
      const adminReceivedMessages = newReceivedMessages.filter(
        (message) => message.sender_type === 'admin'
      );
  
      // Update received messages and unread message count
      setReceivedMessages(adminReceivedMessages);
      setUnreadMessageCount(adminReceivedMessages.length);
    } catch (error) {
      console.error('Error fetching received messages:', error);
    }
  };
  
  const handleReceivedMessage = (newMessage) => {
    if (newMessage.sender_type === 'admin') {
      setReceivedMessages([...receivedMessages, newMessage]);
      // Increment the unread message count
      setUnreadMessageCount(unreadMessageCount + 1);
    }
  };  
  
  // Fetch sent messages
  const fetchSentMessages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/messages/sent_messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: { staff_id: loggedInStaffId },
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
    if (selectedAdminId === null) {
      setSelectedAdminId(1);
    }

    fetchReceivedMessages();
    if (isStaff) {
      fetchSentMessages();
    }
  }, [isStaff, selectedAdminId]);

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
        const response = await axios.get(`${backendUrl}/tasks/received_tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
        const newReceivedTasks = response.data;
    
        // Filter the received messages to only include those from admin
        const adminReceivedTasks = newReceivedTasks.filter(
          (task) => task.send_type === 'admin' || 'staff'
        );
    
        // Update received messages and unread message count
        setTasks(adminReceivedTasks);
        setUnreadTaskCount(adminReceivedTasks.length);
      } catch (error) {
        console.error('Error fetching received tasks:', error);
      }
    };
  
    fetchTasks();
  }, []);  

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
      const response = await axios.get(`${backendUrl}/projects`);
      const data = response.data;
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Perform update operation on projects
  async function updateProject(id, newData) {
    try {
      const token = localStorage.getItem('token'); // Replace with your token

      await axios.put(`${backendUrl}/projects/${id}`, newData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });
      const updatedProjects = projects.map((project) => {
        if (project.id === id) {
          return { ...project, ...newData };
        }
        return project;
      });
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  // Perform delete operation on projects
  async function deleteProjects(id) {
    try {
      const token = localStorage.getItem('token'); // Replace with your token

      await axios.delete(`${backendUrl}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });
      setProjects(projects.filter((project) => project.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  function handleUpdateProject(newProject) {
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
      const token = localStorage.getItem('token'); // Retrieve the staff ID from local storage
      const formId = localStorage.getItem('formId');
      const response = await axios.get(`${backendUrl}/forms?staff_id=${formId}`, {
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
      const token = localStorage.getItem('token'); // Replace with your token

      await axios.put(`${backendUrl}/forms/${id}`, newData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
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

  // Perform delete operation on forms
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
    setForms([...forms, newForm]);
  }

  useEffect(() => {
  const storedTaskCount = localStorage.getItem('unreadTaskCount');
  const storedMessageCount = localStorage.getItem('unreadMessageCount');

  // Set the counts from local storage or default to 0
  setUnreadTaskCount(storedTaskCount ? parseInt(storedTaskCount, 10) : 0);
  setUnreadMessageCount(storedMessageCount ? parseInt(storedMessageCount, 10) : 0);

  // Fetch new counts and update state as needed when new notifications arrive
}, []);

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
      <Navbar updateLoggedIn={updateLoggedIn} setIsCheckedIn={setIsCheckedIn} setIsCheckedOut={setIsCheckedOut} setLoggedInStaff={setLoggedInStaff} setLoggedInManager={setLoggedInManager} setUnreadTaskCount={setUnreadTaskCount} setUnreadMessageCount={setUnreadMessageCount} loggedInStaff={loggedInStaff} useType={useType} />
      <Layout updateLoggedIn={updateLoggedIn} unreadTaskCount={unreadTaskCount} setUnreadTaskCount={setUnreadTaskCount} unreadMessageCount={unreadMessageCount} setUnreadMessageCount={setUnreadMessageCount}>
        <Routes>
          <Route path="/" element={<Navigate to="/stdashboard/isdashboard" />} />
          <Route path="/checkin" 
           element={
           <CheckIn 
            useType={useType} 
            isCheckedIn={isCheckedIn} 
            isCheckedOut={isCheckedOut} 
            setIsCheckedIn={setIsCheckedIn}
            setIsCheckedOut={setIsCheckedOut}/>} 
           />
          <Route path="/checkout" 
           element={
           <CheckOut 
             useType={useType}
             isCheckedIn={isCheckedIn}
             isCheckedOut={isCheckedOut}
             setIsCheckedIn={setIsCheckedIn}
             setIsCheckedOut={setIsCheckedOut}
           />}  />
          <Route path="/profile" element={<ProfilePage staffs={staffs} updateLoggedIn={updateLoggedIn}/>} />
          <Route
            path="/tasks"
            element={<Tasks tasks={tasks} loggedInStaff={loggedInStaff} managers={managers} requests={requests} updateRequest={updateRequest} deleteRequest={deleteRequest} handleUpdateRequest={handleUpdateRequest} progresses={progresses} updateProgress={updateProgress} deleteProgress={deleteProgress} handleUpdateProgress={handleUpdateProgress} setTasks={setTasks} useType={useType} stafId={localStorage.getItem('stafId')} staffs={staffs} />}
          />
          <Route
            path="/chats"
            element={<StaffChat isStaff={isStaff} deleteMessage={deleteMessage} updateMessage={updateMessage} content={content} setContent={setContent} selectedAdminId={selectedAdminId} setSelectedAdminId={setSelectedAdminId} receivedMessages={receivedMessages} sentMessages={sentMessages} setSentMessages={setSentMessages} isAdmin={isAdmin} loggedInStaffId={loggedInStaffId} />} 
          />
          <Route path="/comp-news" element={<CompanyNews company_articles={company_articles} /> } />
           <Route
            path="/isdashboard"
            element={<StaffDashboard 
              useType={useType}
              userType={userType}
              isCheckedIn={isCheckedIn}
              isCheckedOut={isCheckedOut}
              setIsCheckedIn={setIsCheckedIn}
              setIsCheckedOut={setIsCheckedOut}
              tasks={tasks}
              setTasks={setTasks}
              staffs={staffs}
              projects={projects}
              timesheets={timesheets}
              updateSheet={updateSheet}
              onUpdateSheet={handleUpdateSheet}
              loggedInStaff={loggedInStaff}
              forms={forms}
              company_articles={company_articles}
              isStaff={isStaff}
              isAdmin={isAdmin}
              receivedMessages={receivedMessages}
              sentMessages={sentMessages}
              deleteMessage={deleteMessage} 
              updateMessage={updateMessage} 
              content={content} 
              setContent={setContent} 
              selectedAdminId={selectedAdminId} 
              setSelectedAdminId={setSelectedAdminId}
              setSentMessages={setSentMessages} 
              loggedInStaffId={loggedInStaffId}
              messages={messages}
              setReceivedMessages={setReceivedMessages}
              managers={managers}
              requests={requests}
              updateRequest={updateRequest}
              deleteRequest={deleteRequest}
              handleUpdateRequest={handleUpdateRequest}
              progresses={progresses}
              updateProgress={updateProgress}
              deleteProgress={deleteProgress}
              handleUpdateProgress={handleUpdateProgress}
               />}
          />
          <Route
            path="/projects"
            element={
              <Projects
                managers={managers}
                projects={projects}
                updateData={updateProject}
                deleteProjects={deleteProjects}
                handleUpdateProject={handleUpdateProject}
              />
            }
          />
          <Route
            path="/requests"
            element={
              <Request
                tasks={tasks}
                managers={managers}
                useType={useType}
                requests={requests}
                updateRequest={updateRequest}
                deleteRequest={deleteRequest}
                handleUpdateRequest={handleUpdateRequest}
                loggedInStaff={loggedInStaff}
              />
            }
          />

          <Route
            path="/progresses"
            element={
              <TaskProgress
                tasks={tasks}
                useType={useType}
                managers={managers}
                progresses={progresses}
                updateProgress={updateProgress}
                deleteProgress={deleteProgress}
                handleUpdateProgress={handleUpdateProgress}
                loggedInStaff={loggedInStaff}
              />
            }
          />
          <Route
            path="/leave-history"
            element={<LeaveHistory leave_calculations={leave_calculations} forms={forms} deleteForms={deleteForms} deleteCalculations={deleteCalculations} />}
          />
          <Route
            path="/calculation-hist"
            element={<CalculationHistory leave_calculations={leave_calculations} deleteCalculations={deleteCalculations} />}
          />
          <Route
            path="/calculation"
            element={
              <LeaveCalculation
                leave_calculations={leave_calculations}
                staffs={staffs}
                calcId={calcId}
                updateCalculation={updateCalculation}
                deleteCalculations={deleteCalculations}
                handleUpdateCalculation={handleUpdateCalculation}
              />
            }
          />
          <Route path="/leave-form" element={<LeaveForm leave_types={leave_types} setLoggedInStaff={setLoggedInStaff} loggedInStaff={loggedInStaff} staffs={staffs} formId={localStorage.getItem('formId')} setStaffs={setStaffs} onUpdateForm={handleUpdateForm} />} />
          <Route
            path="/leave-request"
            element={<LeaveRequest forms={forms} setForms={setForms} updateForm={updateForm} deleteForms={deleteForms} />}
          />
          <Route
            path="/timesheets"
            element={
              <StartTimesheet
                tasks={tasks}
                managers={managers}
                timesheets={timesheets}
                updateSheet={updateSheet}
                deleteData={deleteData}
                onUpdateSheet={handleUpdateSheet}
                staffId={localStorage.getItem('staffId')}
                useType={useType}
              />
            }
          />
          <Route path="/leave-type" element={<LeaveType />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default StDashboard;