import React, { useState } from 'react';
import StartTimeSheet from './StartTimesheet';
import LeaveForm from './LeaveForm';
import Projects from './Projects';
import Tasks from './Tasks';
import LeaveHistory from './LeaveHistory';
import StaffChat from './StaffChat';
import CompanyNews from './CompanyNews';
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';
import {
  FaInbox,
  FaTasks,
  FaClock,
  FaRegFileAlt,
} from 'react-icons/fa';

function StaffDashboard({
  setIsCheckedIn,
  setIsCheckedOut,
  isCheckedIn,
  isCheckedOut,
  tasks,
  setTasks,
  updateTask,
  projects,
  timesheets,
  onUpdateSheet,
  updateSheet,
  deleteForms,
  onUpdateForm,
  loggedInStaff,
  forms,
  company_articles,
  isStaff,
  isAdmin,
  receivedMessages,
  content,
  setContent,
  selectedAdminId,
  setSelectedAdminId,
  loggedInStaffId,
  setReceivedMessages,
  sentMessages,
  setSentMessages, 
  deleteMessage,
  updateMessage, 
  useType,
  userType,
  setLoggedInStaff,
  managers,
  requests,
  updateRequest,
  deleteRequest,
  handleUpdateRequest,
  progresses,
  updateProgress,
  deleteProgress,
  handleUpdateProgress,
}) {
  const [showHistoryCard, setShowHistoryCard] = useState(false);
  const [showProjectsCard, setShowProjectsCard] = useState(false);
  const [showTasksCard, setShowTasksCard] = useState(false);
  const [showTimeSheetCard, setShowTimeSheetCard] = useState(false);
  const [showLeaveFormCard, setShowLeaveFormCard] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleCardsClick = (cardName) => {
    setShowProjectsCard(cardName === 'projects');
    setShowTasksCard(cardName === 'tasks');
    setShowTimeSheetCard(cardName === 'timesheets');
    setShowLeaveFormCard(cardName === 'forms');
    setShowHistoryCard(cardName === 'history');
    setShowChat(cardName === 'chat');
  };


  return (
    <div className="flex bg-gray-100">
      <main>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
      {!showChat && !showProjectsCard && !showTasksCard && !showTimeSheetCard && !showLeaveFormCard && !showHistoryCard && (
       <div className="grid grid-cols-3 gap-4">
        <div className="cursor-pointer dashboard-card bg-indigo-500" onClick={() => handleCardsClick('projects')}>
          <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
            <div className='flex justify-between'>
              <FaTasks size={25} className="text-lg font-medium mb-2" />
              <h4 className="text-lg text-xlfont-medium mb-2">Projects</h4>
            </div>
              <p className="text-white font-bold text-2xl">{projects.length}</p>
          </div>
      </div>

      <div className="cursor-pointer dashboard-card bg-green-500" 
  onClick={() => {
    handleCardsClick('tasks');
  }}>
  <div className="p-4 rounded-lg shadow-md dark:bg-gray-800 relative">
    <div className='flex justify-between'>
      <FaTasks size={25} className="text-lg font-medium mb-2" />
      <h4 className="text-lg text-xl font-medium mb-2">Tasks</h4>
    </div>
    <p className="text-white font-bold text-2xl">{tasks.length}</p>
  </div>
</div>


      <div className="cursor-pointer dashboard-card bg-red-500" onClick={() => handleCardsClick('timesheets')}>
        <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
          <div className='flex justify-between'>
            <FaClock size={25} className="text-lg font-medium mb-2" />
              <h4 className="text-lg text-xl font-medium mb-2">TimeSheets</h4>
          </div>
              <p className="text-white font-bold text-2xl">{timesheets.length}</p>
        </div>
      </div>

    <div className="cursor-pointer dashboard-card bg-yellow-300" onClick={() => handleCardsClick('forms')}>
      <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
        <div className='flex justify-between'>
            <FaRegFileAlt size={25} className="text-lg font-medium mb-2" />
            <h4 className="text-lg text-xl font-medium mb-2">Leave Form</h4>
        </div>
        <p className="text-white text-2xl">{forms.length}</p>
      </div>
    </div>

    
    <div className="cursor-pointer dashboard-card bg-red-400" onClick={() => handleCardsClick('history')}>
        <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
          <div className='flex justify-between'>
            <FaRegFileAlt size={25} className="text-lg font-medium mb-2" />
              <h4 className="text-lg text-xl font-medium mb-2">Leave History</h4>
          </div>
          <p className="text-white font-bold text-2xl">{forms.length}</p>
        </div>
    </div>

    <div
      className="cursor-pointer dashboard-card bg-lime-500"
      onClick={() => {
      handleCardsClick('chat');
    }}
    >
    <div className="relative p-4 rounded-lg shadow-md dark:bg-gray-800">
        <div className='flex justify-between'>
            <FaInbox size={25} className="text-lg font-medium mb-2" />
            <h4 className="text-lg text-xl font-medium mb-2">Inbox</h4>
            </div>
        </div>
    </div>
  </div>
)}

{showChat && (
  <div>
    <div className='text-left'>
        <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowChat(false)}
        >
          Return Back
        </button>
    </div>
    <StaffChat
      receivedMessages={receivedMessages}
      sentMessages={sentMessages}
      setSentMessages={setSentMessages}
      setReceivedMessages={setReceivedMessages}
      content={content}
      setContent={setContent}
      selectedAdminId={selectedAdminId}
      setSelectedAdminId={setSelectedAdminId}
      isStaff={isStaff}
      isAdmin={isAdmin}
      loggedInStaffId={loggedInStaffId}
      deleteMessage={deleteMessage}
      updateMessag={updateMessage}
    />
  </div>
)}

{showProjectsCard && (
  <div>
    <div className='text-left'>
        <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowProjectsCard(false)}
        >
          Return Back
        </button>
    </div>
    <Projects
      projects={projects}
    />
  </div>
)}

{showTasksCard && (
  <div>
    <div className='text-left'>
        <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowTasksCard(false)}
        >
          Return Back
        </button>
    </div>
    <Tasks
      useType={useType}
      tasks={tasks}
      setTasks={setTasks}
      updateTask={updateTask}
      managers={managers}
      requests={requests}
      updateRequest={updateRequest}
      deleteRequest={deleteRequest}
      handleUpdateRequest={handleUpdateRequest}
      progresses={progresses}
      updateProgress={updateProgress}
      deleteProgress={deleteProgress}
      handleUpdateProgress={handleUpdateProgress}
      loggedInStaff={loggedInStaff}
    />
  </div>
)}

{showLeaveFormCard && (
  <div>
    <div className='text-left'>
        <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowLeaveFormCard(false)}
        >
          Return Back
        </button>
    </div>
    <LeaveForm
      forms={forms}
      onUpdateForm={onUpdateForm}
      loggedInStaff={loggedInStaff}
    />
  </div>
)}

{showTimeSheetCard && (
  <div>
    <div className='text-left'>
        <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowTimeSheetCard(false)}
        >
          Return Back
        </button>
    </div>
    <StartTimeSheet 
      tasks={tasks}
      timesheets={timesheets}
      onUpdateSheet={onUpdateSheet}
      updateSheet={updateSheet}
    />
  </div>
)}

{showHistoryCard && (
  <div>
    <div className='text-left'>
        <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowHistoryCard(false)}
        >
          Return Back
        </button>
    </div>
    <LeaveHistory
      forms={forms}
      deleteForms={deleteForms}
    />
  </div>
)}

{useType === 'staff' && (
  <div className="dashboard-card bg-purple">
    <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
      <h4 className="text-lg font-medium">Check-In / Check-Out</h4>
      <div className="flex justify-evenly">
        <div style={{ marginLeft: "3rem", marginRight: "1rem" }}>
          <CheckIn 
            isCheckedIn={isCheckedIn}
            isCheckedOut={isCheckedOut}
            setIsCheckedIn={setIsCheckedIn}
            setIsCheckedOut={setIsCheckedOut}
          />
        </div>
        <div style={{ marginRight: "2rem"}}>
          <CheckOut 
            isCheckedIn={isCheckedIn}
            isCheckedOut={isCheckedOut}
            setIsCheckedIn={setIsCheckedIn}
            setIsCheckedOut={setIsCheckedOut}
          />
        </div>
      </div>
    </div>
  </div>
)}

      </main>
      <aside className="w-1/2 p-6 border-l border-gray-300">
        <CompanyNews company_articles={company_articles}/>
      </aside>
    </div>
  );
}

export default StaffDashboard;
