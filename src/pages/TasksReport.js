import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';

function TasksReport({ tasks, deleteTask }) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  return (
    <div className="mx-auto bg-white rounded-lg shadow-lg ml-15 px-5 pb-8 pt-3">
      <div className="report-details">
        <div className="row">
          <div className="col-sm-3 mt-5 mb-4 text-gred">
            <div className="search">
              <form className="form-inline">
                <input className="form-control mr-sm-2" type="search" placeholder="Search Report" aria-label="Search" />
              </form>
            </div>
          </div>
          <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: 'green' }}>
            <h3>
              <b>Tasks Report Details</b>
            </h3>
          </div>
        </div>
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-sm">
              <thead>
                <tr>
                  <th>Date Assigned</th>
                  <th>Staff Name</th>
                  <th>Task Assigned</th>
                  <th>Project Name</th>
                  <th>Task Manager</th>
                  <th>Project Manager</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks && Array.isArray(tasks) && 
                tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.assignment_date}</td>
                  <td>{task.assigned_to}</td>
                  <td>{task.task_name}</td>
                  <td>{task.project_name}</td>
                  <td>{task.task_manager}</td>
                  <td>{task.project_manager}</td>
                  <td className="text-center">
                  <div className="d-flex justify-content-center">
                    <Button variant="danger" onClick={() =>deleteTask(task.id)}>
                      Delete
                    </Button>
                   </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksReport;
