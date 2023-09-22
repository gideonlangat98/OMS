import React, { useState, useEffect, useContext, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Tasks from './pages/Tasks';
import Staff from './pages/Staff';
import Projects from './pages/Projects';
import LeaveRequest from './pages/LeaveRequest';
import LeaveForm from './pages/LeaveForm';
import { LeaveType } from './pages/LeaveType';
import Client from './pages/Client';
import TimeSheets from './pages/TimeSheets';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CheckStatus from './pages/CheckStatus';
import LeaveHistory from './pages/LeaveHistory';
import CalculationHistory from './pages/CalculationHistory';
import Managers from './pages/Managers';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import StDashboard from './components/StDashboard';
import LeaveCalculation from './pages/LeaveCalculation';
import Dashboard from './pages/Dashboard';
import CompanyNews from './pages/CompanyNews';
import NewsArticle from './pages/NewsArticle';
import AdminChat from './pages/AdminChat';
import StaffChat from './pages/StaffChat';
import Request from './pages/Request';
import TaskProgress from './pages/TaskProgress';
import StaffDashboard from './pages/StaffDashboard';
import { OmsContext } from './components/auth/AuthContext';
import CheckIn from './pages/CheckIn'
import CheckOut from './pages/CheckOut';
import StartTimesheet from './pages/StartTimesheet';
import Meeting from './pages/Meeting';
import TasksReport from './pages/TasksReport';
import ManagerDashboard from './components/ManagerDashboard';
import axios from 'axios';

function App() {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [isadmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [company_articles, setCompany_Articles] = useState([]);
  const [userType, setUserType] = useState('admin');
  const [useType, setUseType] = useState('staff');
  const [usingType, setUsingType] = useState('manager');
  // const [loggedInSeen, setLoggedInSeen] = useState('');
  // const [lastSeen, setLastSeen] = useState('');
  const [loggedInStaff, setLoggedInStaff] = useState(localStorage.getItem('loggedInStaff') || '');
  const [loggedInStaffId, setLoggedInStaffId] = useState('');
  const [loggedInManager, setLoggedInManager] = useState(localStorage.getItem('loggedInManager') || '');
  const [managers, setManagers] = useState('');
  const [leave_calculations, setLeave_calculations] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(null);
  const [isCheckedOut, setIsCheckedOut] = useState(null);
  const { backendUrl } = useContext(OmsContext);

  useEffect(() => {
    fetchManagers();
    fetchStaffs();
    fetchCalculations();
    fetchArticles();
    checkLoggedIn();
  }, []);

  useEffect(() => {
    const storedArticles = localStorage.getItem('company_articles');
    if (storedArticles) {
      setCompany_Articles(JSON.parse(storedArticles));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('company_articles', JSON.stringify(company_articles));
  }, [company_articles]);

  async function fetchArticles() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/company_articles`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setCompany_Articles(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Perform update operation on staffs
  async function updateArticle(id, newData) {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${backendUrl}/company_articles/${id}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedArticles = company_articles.map((company_article) => {
        if (company_article.id === id) {
          return { ...company_article, ...newData };
        }
        return company_article;
      });
      setCompany_Articles(updatedArticles);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  async function deleteArticles(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/company_articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCompany_Articles(company_articles.filter(company_article => company_article.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  function handleUpdateArticle(newArticle) {
    setCompany_Articles([...company_articles, newArticle])
  }

  // Fetch Calculations
  useEffect(() => {
    const storedCalculations = localStorage.getItem('leave_calculations');
    if (storedCalculations) {
      setLeave_calculations(JSON.parse(storedCalculations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('leave_calculations', JSON.stringify(leave_calculations));
  }, [leave_calculations]);

  async function fetchCalculations() {
    try {
      const token = localStorage.getItem('token'); // Retrieve the staff ID from local storage
      const calcId = localStorage.getItem('calcId');
      const response = await axios.get(`${backendUrl}/leave_calculations?staff_id=${calcId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setLeave_calculations(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteCalculation = (staffId) => {
    // Remove the deleted calculation from the state
    setLeave_calculations((prevCalculations) => prevCalculations.filter((calc) => calc.staff_id !== staffId));
  };

  const updateCalculation = (updatedCalculation) => {
    // Update the calculation in the leave_calculations state
    setLeave_calculations((prevCalculations) =>
      prevCalculations.map((calc) =>
        calc.id === updatedCalculation.id ? updatedCalculation : calc
      )
    );
  };

  function handleUpdateCalculation(newCalculation) {
    setLeave_calculations([...leave_calculations, newCalculation]);
  }

  // Fetch staffs
  useEffect(() => {
    const storedStaffs = localStorage.getItem('staffs');
    if (storedStaffs) {
      setStaffs(JSON.parse(storedStaffs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('staffs', JSON.stringify(staffs));
  }, [staffs]);

  async function fetchStaffs() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/staffs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = response.data;
      setStaffs(data);
      setLoggedInStaff(data.staff_name)
      setLoggedInStaffId(data.staff_id)
    } catch (error) {
      console.log(error);
    }
  }

  // Perform update operation on staffs
  async function updateStaff(id, newData) {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${backendUrl}/staffs/${id}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const updatedStaffs = staffs.map((staff) => {
        if (staff.id === id) {
          return { ...staff, ...newData };
        }
        return staff;
      });
      setStaffs(updatedStaffs);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  // Perform delete operation on staffs
  async function deleteStaffs(id) {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/staffs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStaffs(staffs.filter((staff) => staff.id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  }

  function handleUpdateStaff(newStaff) {
    setStaffs([...staffs, newStaff]);
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
      setLoggedInManager(data.f_name)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // Check if the user is logged in
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setIsLoggedIn(true);
      setIsAdmin(storedUser.isadmin);
      setIsStaff(storedUser.isStaff) ;
      setIsManager(storedUser.isManager);
      // setLoggedInStaff(storedUser.staff_name); // Set the loggedInStaff based on the staff_name of the logged-in user
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isAdmin', storedUser.isadmin ? 'true' : 'false');
      localStorage.setItem('isStaff', storedUser.isStaff ? 'true' : 'false');
      localStorage.setItem('isManager', storedUser.isManager ? 'true' : 'false');
      localStorage.setItem('token', storedUser.token);
    }
  }, []);

  function handleLogin(user) {
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setIsAdmin(user.isadmin);
    setIsStaff(user.isStaff);
    setIsManager(user.isManager);
    
    localStorage.setItem('isLoggedIn', 'true'); // Add this line to store the login state
    localStorage.setItem('isAdmin', user.isadmin ? 'true' : 'false');
    localStorage.setItem('isStaff', user.isStaff ? 'true' : 'false');
    localStorage.setItem('isManager', user.isManager ? 'true' : 'false');
    localStorage.setItem('token', user.token);

    if(user.isStaff) {
      setLoggedInStaff(user.staff_name);
    }else if(user.isManager){
      setLoggedInManager(user.f_name);
    }

  }

  function updateLoggedIn(flag) {
    setIsLoggedIn(flag);
  }

  function checkLoggedIn() {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    const storedIsStaff = localStorage.getItem('isStaff');
    const storedIsManager = localStorage.getItem('isManager');

    if (storedIsLoggedIn && storedIsAdmin && storedIsStaff && storedIsManager) {
      setIsLoggedIn(storedIsLoggedIn === 'true');
      setIsAdmin(storedIsAdmin === 'true');
      setIsStaff(storedIsStaff === 'true');
      setIsManager(storedIsManager === 'true');
    }
  }

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isloggedIn);
    localStorage.setItem('isAdmin', isadmin);
    localStorage.setItem('isStaff', isStaff);
    localStorage.setItem('isManager', isManager);
  }, [isloggedIn, isadmin, isStaff, isManager]);

  useEffect(() => {
    // Store loggedInStaff in localStorage when it changes
    localStorage.setItem('loggedInStaff', loggedInStaff);
    localStorage.setItem('loggedInManager', loggedInManager);
  }, [loggedInStaff, loggedInManager]);

  return (
    <Router>
      <Routes>
      <Route
  path="/"
  element={
    isloggedIn ? (
      isadmin ? (
        <Navigate to="/admindashboard/dashboard" replace />
      ) : isStaff ? (
        <Navigate to="/stdashboard/isdashboard" replace />
      ) : (
        <Navigate to="/managerdashboard/managerdash" replace />
      )
    ) : (
      <Login onLogin={handleLogin} />
    )
  }
/>

<Route path="/"/>
        <Route
          path="/signup"
          element={
            <Signup />
          }
        />
        <Route
          path="/admindashboard/*"
          element={
            isadmin ? (
              <AdminDashboard
                updateLoggedIn={updateLoggedIn}
                isLoggedIn={isloggedIn}
                isAdmin={isadmin}
                isStaff={isStaff}
                staffs={staffs}
                handleUpdateStaff={handleUpdateStaff}
                deleteStaff={deleteStaffs}
                updateStaff={updateStaff}
                leave_calculations={leave_calculations}
                setLeave_calculations={setLeave_calculations}
                calcId={localStorage.getItem('calcId')}
                handleUpdateCalculation={handleUpdateCalculation}
                deleteCalculations={handleDeleteCalculation}
                updateCalculation={updateCalculation}
                userType={userType}
                useType={useType}
                setIsCheckedIn={setIsCheckedIn}
                setIsCheckedOut={setIsCheckedOut}
                company_articles={company_articles}
                setCompany_Articles={setCompany_Articles} 
                deleteArticle={deleteArticles} 
                updateArticle={updateArticle} 
                handleUpdateArticle={handleUpdateArticle}
                setLoggedInStaff={setLoggedInStaff} 
                setLoggedInManager={setLoggedInManager}
              >
                {leave_calculations.map((calculation) => (
                  <LeaveCalculation
                    key={calculation.id}
                    calcId={calculation.id} // Pass the correct calculation ID as prop
                    handleUpdateCalculation={handleUpdateCalculation}
                    deleteCalculations={handleDeleteCalculation} // Pass the correct delete function
                    staffs={staffs}
                    dashboardType="admin"
                    leave_calculations={leave_calculations}
                    setLeave_calculations={setLeave_calculations}
                  />
                ))}
              </AdminDashboard>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/stdashboard/*"
          element={
            isStaff ? (
              <StDashboard
                updateLoggedIn={updateLoggedIn}
                isLoggedIn={isloggedIn}
                isAdmin={isadmin}
                isStaff={isStaff}
                staffs={staffs}
                setStaffs={setStaffs}
                loggedInStaff={loggedInStaff}
                loggedInStaffId={loggedInStaffId}
                setLoggedInStaff={setLoggedInStaff}
                setLoggedInManager={setLoggedInManager}
                useType={useType}
                userType={userType}
                isCheckedIn={isCheckedIn}
                isCheckedOut={isCheckedOut}
                setIsCheckedIn={setIsCheckedIn}
                setIsCheckedOut={setIsCheckedOut}
                handleUpdateStaff={handleUpdateStaff}
                deleteStaff={deleteStaffs}
                updateStaff={updateStaff}
                leave_calculations={leave_calculations}
                calcId={localStorage.getItem('calcId')}
                setLeave_calculations={setLeave_calculations}
                handleUpdateCalculation={handleUpdateCalculation}
                deleteCalculations={handleDeleteCalculation}
                updateCalculation={updateCalculation}
                company_articles={company_articles}
                setCompany_Articles={setCompany_Articles} 
                deleteArticle={deleteArticles} 
                updateArticle={updateArticle} 
                handleUpdateArticle={handleUpdateArticle}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/managerdashboard/*"
          element={
            isManager ? (
              <ManagerDashboard
                updateLoggedIn={updateLoggedIn}
                isLoggedIn={isloggedIn}
                isManager={isManager}
                usingType={usingType}
                managers={managers}
                loggedInManager={loggedInManager}
                staffs={staffs}
                userType={userType}
                setLoggedInManager={setLoggedInManager}
                setLoggedInStaff={setLoggedInStaff}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/check-status" element={<CheckStatus />} />
        <Route
          path="/task-report"
          element={<TasksReport />}
        />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/request" element={<Request />} />
        <Route path="/task-progress" element={<TaskProgress />} />
        <Route path="/chat" element={<AdminChat /> } />
        <Route path="/chats" element={<StaffChat /> } />
        <Route path="/isdashboard" element={<StaffDashboard company_articles={company_articles} />} />
        <Route path="/news" element={<NewsArticle company_articles={company_articles} setCompany_Articles={setCompany_Articles} deleteArticle={deleteArticles} updateArticle={updateArticle} handleUpdateArticle={handleUpdateArticle} />} />
        <Route path="/comp-news" element={<CompanyNews company_articles={company_articles} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leave-history" element={<LeaveHistory />} />
        <Route path="/calculation-hist" element={<CalculationHistory />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/timesheets" element={<StartTimesheet />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/manager" element={<Managers />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/calculation" element={<LeaveCalculation />} />
        <Route path="/timesheets" element={<TimeSheets />} />
        <Route path="/client" element={<Client />} />
        <Route path="/leave-form" element={<LeaveForm />} />
        <Route path="/leave-request" element={<LeaveRequest />} />
        <Route path="/leave-type" element={<LeaveType />} />
      </Routes>
    </Router>
  );
}

export default App;