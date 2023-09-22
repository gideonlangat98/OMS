import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import StaffSide from './StaffSide'

const Layout = ({ children, updateLoggedIn, unreadMessageCount, setUnreadMessageCount, unreadTaskCount, setUnreadTaskCount }) => {
  const location = useLocation();
  const [dashboardType, setDashboardType] = useState('staff'); // Set the initial dashboard type

  // Check if the current location matches the dashboard path
  const isDashboard = location.pathname.startsWith('/stdashboard');

  return (
    <div className="flex h-screen text-center">
      {isDashboard && (
        <div className="w-1/5 bg-gray-200">
        <StaffSide updateLoggedIn={updateLoggedIn} unreadTaskCount={unreadTaskCount} setUnreadTaskCount={setUnreadTaskCount} unreadMessageCount={unreadMessageCount} setUnreadMessageCount={setUnreadMessageCount} dashboardType={dashboardType} />
        </div>
      )}
      <div className="w-4/5 flex-grow overflow-y-auto bg-gray-100">
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Layout;