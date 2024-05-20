import React, { useState } from 'react';

function TitleForm({task, onTaskChange }) {
  // No need for internal state 'title' anymore

  const handleChange = (event) => {
    if (onTaskChange) {
      const updatedTask = { ...task, title: event.target.value }; // Create a new object with updated title
      onTaskChange(updatedTask); // Call the callback with the new task object
    }
  };

  return (
    <div className='task-details-form'>
      <form onSubmit={(event) => event.preventDefault()}> {/* Prevent default form submission */}
        <input
          className='title-form'
          id="title"
          name="title"
          placeholder="Task Name"
          value={task.title || ''} // Use passed-in description or empty string
          onChange={handleChange}
        />
      </form>
    </div>
  );
}

export default TitleForm;
