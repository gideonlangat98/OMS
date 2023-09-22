import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ManagerSide from './ManagerSide';

const ManagerLayout = ({ children, updateLoggedIn }) => {
  const location = useLocation();
  const [dashboardType, setDashboardType] = useState('manager');

  const isDashboard = location.pathname.startsWith('/managerdashboard');

  return (
    <div className="flex h-screen text-center">
      {isDashboard && (
        <div className="w-1/5 bg-gray-200">
          <ManagerSide updateLoggedIn={updateLoggedIn} dashboardType={dashboardType} />
        </div>
      )}
      <div className="w-4/5 flex-grow overflow-y-auto bg-gray-100">
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default ManagerLayout;