import * as React from 'react';
const Employee = ({ id, name, email, status, onDelete }) => {
    return (
    <div className="employee-div manage-employee-div">
      <p className="employee-name">{name}</p>
      <p className="employee-email">{email}</p>
      <p className={`employee-status ${status === "Active" ? "status-active" : "status-inactive"}`}>
        {status}
    </p>
      <button className="employee-edit">Edit</button>
      <button className="employee-delete" onClick={() => onDelete(id)}>Delete</button>
    </div>
    )
}

export default React.memo(Employee)