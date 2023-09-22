import React from 'react';

const Inbox = () => {
  return (
    <div className="flex flex-col bg-gray-100 border border-gray-200 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Inbox</h3>
      <div className="overflow-y-auto max-h-64">
        <div className="flex flex-col border-b border-gray-200 py-2">
          <div className="flex justify-between">
            <span className="text-gray-600">From: Admin</span>
            <span className="text-gray-600">Date: 2023-08-21</span>
          </div>
          <p className="text-gray-800 mt-2">Hello, this is a sample message from the admin.</p>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
