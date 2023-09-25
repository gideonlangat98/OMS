import React, { useState } from 'react';
import Staff from './Staff';
import Managers from './Managers';
import Client from './Client';
import Projects from './Projects';
import Tasks from './Tasks';
import TimeSheets from './TimeSheets';
import { LeaveType } from './LeaveType';
import LeaveRequest from './LeaveRequest';
import LeaveCalculation from './LeaveCalculation';
import TasksReport from './TasksReport'
import AdminChat from './AdminChat';
import {
  FaInbox,
  FaUser,
  FaUserTie,
  FaUsers,
  FaTasks,
  FaClock,
  FaRegSnowflake,
  FaRegFileAlt,
  FaCalculator,
  FaChevronLeft,
} from 'react-icons/fa';

function Dashboard({
  loggedInStaff,
  handleUpdateStaff,
  updateStaff,
  deleteStaff,
  managers,
  staffs,
  deleteManager,
  handleUpdateManager,
  updateManager,
  tasks,
  updateTask,
  deleteTask,
  handleUpdateTask,
  onUpdateClient,
  clients,
  deleteClients,
  onUpdate,
  projects,
  handleUpdateProject,
  updateProject,
  deleteProject,
  timesheets,
  updateSheet,
  deleteSheet,
  handleUpdateSheet,
  leave_types,
  updateLeave,
  handleUpdateLeave,
  deleteLeave,
  forms,
  leave_calculations,
  deleteMessage,
  updateMessage,
  receivedMessages,
  sentMessages,
  setReceivedMessages,
  setSentMessages,
  isAdmin,
  content,
  setContent,
  selectedStaffId,
  setSelectedStaffId,
  userType,
}) {

  const [showChat, setShowChat] = useState(false);
  const [showStaffCard, setShowStaffCard] = useState(false);
  const [showManagerCard, setShowManagerCard] = useState(false);
  const [showClientCard, setShowClientCard] = useState(false);
  const [showProjectsCard, setShowProjectsCard] = useState(false);
  const [showTasksCard, setShowTasksCard] = useState(false);
  const [showTimeSheetsCard, setShowTimeSheetsCard] = useState(false);
  const [showLeaveCard, setShowLeaveCard] = useState(false);
  const [showRequestCard, setShowRequestCard] = useState(false);
  const [showCalculationCard, setShowCalculationCard] = useState(false);
  const [showReport, setShowReport] = useState(false);


  const handleCardClick = (cardName) => {
    setShowChat(cardName === 'chats');
    setShowStaffCard(cardName === 'staffs');
    setShowManagerCard(cardName === 'managers');
    setShowClientCard(cardName === 'clients');
    setShowProjectsCard(cardName === 'projects');
    setShowTasksCard(cardName === 'tasks');
    setShowTimeSheetsCard(cardName === 'timesheets');
    setShowLeaveCard(cardName === 'leave_types');
    setShowRequestCard(cardName === 'forms');
    setShowCalculationCard(cardName === 'leave_calculations');
    setShowReport(cardName === 'reports');
  };

  return (
    <div>
      <h2 className='text-blue'>Dashboard Overview</h2>

      {!showChat && !showReport && !showStaffCard && !showManagerCard && !showClientCard && !showProjectsCard && !showTasksCard && !showTimeSheetsCard && !showLeaveCard && !showRequestCard && !showCalculationCard && (
        <div className="grid grid-cols-3 gap-4">
          <div
            className="cursor-pointer dashboard-card rounded-md bg-lime-500"
            onClick={() => {
              handleCardClick('chats');
            }}
          >
            <div className="relative p-4 rounded-lg shadow-md rounded-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaInbox size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Inbox</h4>
              </div>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card rounded-md bg-cyan-500" onClick={() => handleCardClick('staffs')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaUser size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Staffs</h4>
              </div>
              <p className="text-white font-bold text-2xl">{staffs.length}</p>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card rounded-md bg-purple-500" onClick={() => handleCardClick('managers')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaUserTie size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Managers</h4>
              </div>
              <p className="text-white font-bold text-2xl">{managers.length}</p>
            </div>
          </div>
          <div className="cursor-pointer dashboard-card rounded-md bg-blue-500" onClick={() => handleCardClick('clients')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaUsers size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Clients</h4>
              </div>
              <p className="text-white font-bold text-2xl">{clients.length}</p>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card rounded-md bg-indigo-500" onClick={() => handleCardClick('projects')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
             <div className='flex justify-between'>
                 <FaTasks size={25} className="text-lg font-medium mb-2" />
                 <h4 className="text-lg text-xlfont-medium mb-2">Projects</h4>
             </div>
              <p className="text-white font-bold text-2xl">{projects.length}</p>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card rounded-md bg-green-500" onClick={() => handleCardClick('tasks')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
             <div className='flex justify-between'>
                 <FaTasks size={25} className="text-lg font-medium mb-2" />
                 <h4 className="text-lg text-xl font-medium mb-2">Tasks</h4>
             </div>
              <p className="text-white font-bold text-2xl">{tasks.length}</p>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card rounded-md bg-red-500" onClick={() => handleCardClick('timesheets')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaClock size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">TimeSheets</h4>
              </div>
              <p className="text-white font-bold text-2xl">{timesheets.length}</p>
            </div>
          </div>
          
          <div className="cursor-pointer dashboard-card rounded-md bg-pink-500" onClick={() => handleCardClick('leave_types')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaRegSnowflake size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Leave Types</h4>
              </div>
              <p className="text-white font-bold text-2xl">{leave_types.length}</p>
            </div>
          </div>
          
          <div className="cursor-pointer dashboard-card rounded-md bg-red-400" onClick={() => handleCardClick('forms')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaRegFileAlt size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Leave Requests</h4>
              </div>
              <p className="text-white font-bold text-2xl">{forms.length}</p>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card rounded-md bg-yellow-500" onClick={() => handleCardClick('leave_calculations')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaCalculator size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Leave Calculation</h4>
              </div>
              <p className="text-white font-bold text-2xl">{leave_calculations.length}</p>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card rounded-md bg-fuchsia-500" onClick={() => handleCardClick('reports')}>
            <div className="p-4 shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaRegFileAlt size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Tasks Report</h4>
              </div>
              <p className="text-white font-bold text-2xl">{tasks.length}</p>
            </div>
          </div>

        </div>
      )}

      {showChat && (
        <div>
          <button style={{ marginRight: "36rem" }} className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowChat(false)}
          >
            Return Back
          </button>
          <AdminChat
            staffs={staffs}
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
          />
        </div>
      )}

      {showStaffCard && (
        <div>
          <div className='text-left'>
              <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => setShowStaffCard(false)}
              >
                Return Back
              </button>
          </div>
          
          <Staff
            staffs={staffs}
            handleUpdateStaff={handleUpdateStaff}
            deleteStaff={deleteStaff}
            updateStaff={updateStaff}
            managers={managers}
          />
        </div>
      )}

      {showManagerCard && (
        <div>
          <div className='text-left'>
              <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => setShowManagerCard(false)}
              >
                Return Back
              </button>
          </div>
          <Managers
            managers={managers}
            handleUpdateManager={handleUpdateManager}
            deleteManager={deleteManager}
            updateManager={updateManager}
          />
        </div>
      )}

      {showClientCard && (
        <div>
          <div className='text-left'>
              <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => setShowClientCard(false)}
              >
                Return Back
              </button>
          </div>
          <Client
            clients={clients} 
            onUpdateClient={onUpdateClient} 
            deleteClients={deleteClients} 
            onUpdate={onUpdate}
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
            handleUpdateProject={handleUpdateProject}
            deleteProject={deleteProject}
            updateProject={updateProject}
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
            userType={userType}
            tasks={tasks}
            handleUpdateTask={handleUpdateTask}
            deleteTask={deleteTask}
            updateTask={updateTask}
            loggedInStaff={loggedInStaff}
          />
        </div>
      )}

      {showTimeSheetsCard && (
        <div>
          <div className='text-left'>
              <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => setShowTimeSheetsCard(false)}
              >
                Return Back
              </button>
          </div>
          <TimeSheets
            timesheets={timesheets}
            handleUpdateSheet={handleUpdateSheet}
            deleteSheet={deleteSheet}
            updateSheet={updateSheet}
          />
        </div>
      )}

     {showLeaveCard && (
        <div>
          <div className='text-left'>
              <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => setShowLeaveCard(false)}
              >
                Return Back
              </button>
          </div>
          <LeaveType
            leave_types={leave_types}
            handleUpdateLeave={handleUpdateLeave}
            deleteLeave={deleteLeave}
            updateLeave={updateLeave}
          />
        </div>
      )}

     {showRequestCard && (
        <div>
          <div className='text-left'>
              <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => setShowRequestCard(false)}
              >
                Return Back
              </button>
          </div>
          <LeaveRequest
            forms={forms}
          />
        </div>
      )}

      {showCalculationCard && (
        <div>
          <div className='text-left'>
              <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => setShowCalculationCard(false)}
              >
                Return Back
              </button>
          </div>
          <LeaveCalculation
            forms={forms}
            leave_types={leave_types}
            leave_calculations={leave_calculations}
            staffs={staffs}
          />
        </div>
      )}

      {showReport && (
        <div>
          <div className='text-left'>
              <button className="mt-2 mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               onClick={() => setShowReport(false)}
              >
                Return Back
              </button>
          </div>
          <TasksReport
            tasks={tasks}
            deleteTask={deleteTask}
          />
        </div>
      )}

    </div>
  );
}

export default Dashboard;
