import React, { useState } from 'react';

function DescriptionForm({task, onTaskChange }) {
  // No need for internal state 'title' anymore

  const handleChange = (event) => {
    if (onTaskChange) {
      const updatedTask = { ...task, description: event.target.value }; // Create a new object with updated title
      onTaskChange(updatedTask); // Call the callback with the new task object
    }
  };

  return (
      <form onSubmit={(event) => event.preventDefault()}> {/* Prevent default form submission */}
        <textarea
          className='description-form'
          id="title"
          name="title"
          placeholder="Subtask Description"
          value={task.description || ''} // Use passed-in description or empty string
          onChange={handleChange}
        />
      </form>
  );
}

export default DescriptionForm;
