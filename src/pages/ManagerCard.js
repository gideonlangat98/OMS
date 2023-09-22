import React, { useState } from 'react';
import Projects from './Projects';
import Tasks from './Tasks';
import TasksReport from './TasksReport';
import {
  FaTasks,
  FaRegFileAlt,
} from 'react-icons/fa';

function ManagerCard({
  setLoggedInManager,
  projects,
  handleUpdateProject,
  updateProject,
  deleteProject,
  usingType,
  tasks,
  updateTask,
  deleteTask,
  handleUpdateTask,
  loggedInStaff,
  userType,
  
}) {


  const [showProjectsCard, setShowProjectsCard] = useState(false);
  const [showTasksCard, setShowTasksCard] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleCardClick = (cardName) => {
    setShowProjectsCard(cardName === 'projects');
    setShowTasksCard(cardName === 'tasks');
    setShowReport(cardName === 'reports');
  };

  return (
    <div>
      <h2 className='text-blue'>Dashboard Overview</h2>

      {!showProjectsCard && (
        <div className="grid grid-cols-3 gap-4">
          
          <div className="cursor-pointer dashboard-card bg-indigo-500" onClick={() => handleCardClick('projects')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
             <div className='flex justify-between'>
                 <FaTasks size={25} className="text-lg font-medium mb-2" />
                 <h4 className="text-lg text-xlfont-medium mb-2">Projects</h4>
             </div>
              <p className="text-white font-bold text-2xl">{projects.length}</p>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card bg-fuchsia-500" onClick={() => handleCardClick('reports')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
              <div className='flex justify-between'>
                  <FaRegFileAlt size={25} className="text-lg font-medium mb-2" />
                  <h4 className="text-lg text-xl font-medium mb-2">Tasks Report</h4>
              </div>
              <p className="text-white font-bold text-2xl">{tasks.length}</p>
            </div>
          </div>

          <div className="cursor-pointer dashboard-card bg-green-500" onClick={() => handleCardClick('tasks')}>
            <div className="p-4 rounded-lg shadow-md dark:bg-gray-800">
             <div className='flex justify-between'>
                 <FaTasks size={25} className="text-lg font-medium mb-2" />
                 <h4 className="text-lg text-xl font-medium mb-2">Tasks</h4>
             </div>
              <p className="text-white font-bold text-2xl">{tasks.length}</p>
            </div>
          </div>

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
            usingType={usingType}
            setLoggedInManager={setLoggedInManager}
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

export default ManagerCard;
