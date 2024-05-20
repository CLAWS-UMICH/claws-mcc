import React, { useEffect, useState } from 'react';
// import CheckBox from '../common/CheckBox/CheckBox';
import './task-list.css';
import { set } from 'lodash';
import ProgressBar from './progress-bar';
import TitleForm from './title-form';
import Description from '../common/Description/Description';
import DescriptionForm from './description-form';
import useDynamicWebSocket from '../../hooks/useWebSocket';
// import TwoColumnLayout from './column-layout.tsx';

export type Astronaut = {
	astronaut_id: number;
	ready: boolean;
}

export enum TaskStatus {
  INPROGRESS = 0,
	TODO = 1,
	EMERGENCY = 2,
	COMPLETED = 3, 
}

export type Task = {
	id: number;
	subtask: boolean;
	title: string;
	description: string; 
	status: TaskStatus;
	astronauts: Astronaut[];
	subtasks?: Task[];
}
export const dummyTasks: Task[] = [
	{
	  id: 1,
	  subtask: true,
	  title: "Prepare for Spacewalk",
	  description: "Gather necessary tools and equipment for the upcoming spacewalk mission. Ensure proper suit functionality and oxygen levels.",
	  status: TaskStatus.TODO,
	  astronauts: [{ astronaut_id: 0, ready: true }], // Update astronauts here
	  subtasks: [
		{
		  id: 11,
		  subtask: true,
		  title: "Check suit integrity",
		  description: "Run diagnostic tests on the spacesuit to ensure no leaks or malfunctions.",
		  status: TaskStatus.TODO,
		  astronauts: [],
		},
		{
		  id: 12,
		  subtask: true,
		  title: "Assemble tools",
		  description: "Gather and prepare all necessary tools needed for the planned spacewalk activities.",
		  status: TaskStatus.TODO,
		  astronauts: [],
		},
	  ],
	},
  {
	  id: 2,
	  subtask: true,
	  title: "Apple Bottom Jeans",
	  description: "Gather necessary tools and equipment for the upcoming spacewalk mission. Ensure proper suit functionality and oxygen levels.",
	  status: TaskStatus.TODO,
	  astronauts: [{ astronaut_id: 0, ready: true }], // Update astronauts here
	  subtasks: [
		{
		  id: 21,
		  subtask: true,
		  title: "Check suit integrity",
		  description: "Run diagnostic tests on the spacesuit to ensure no leaks or malfunctions.",
		  status: TaskStatus.TODO,
		  astronauts: [],
		},
	  ],
	},
	{
	  id: 3,
	  subtask: true,
	  title: "Apple Bottom Jeans",
	  description: "Gather necessary tools and equipment for the upcoming spacewalk mission. Ensure proper suit functionality and oxygen levels.",
	  status: TaskStatus.TODO,
	  astronauts: [{ astronaut_id: 0, ready: true }], // Update astronauts here
	  subtasks: [
		{
		  id: 31,
		  subtask: true,
		  title: "Check suit integrity",
		  description: "Run diagnostic tests on the spacesuit to ensure no leaks or malfunctions.",
		  status: TaskStatus.TODO,
		  astronauts: [],
		},
	  ],
	},
  ];

    // const tasksInProgress = [ 
    //     {id: 0, title: 'Task 0 Title', description: "Task 0 description",
    //     status: 0, astronauts: ["Alice", "Bob"], subtasks: []},

    //     {id: 1, title: 'Task 1 Title', description: "Task 1 description",
    //     status: 0, astronauts: ["Alice"], subtasks: []}
    // ]
    

    // export type Task = {
    //     id: number; //eventually replace with ObjectId
    //     title: string;
    //     description: string;
    //     status: number;
    //     astronauts: [];
    //     subtasks: [];
    // }


export function TaskList() {
    // FIXME! might not actually need separate variables for these but need to decide how to 
    // differentiate in progress, to-do, completed, and emergency tasks
    const [tasksInProgress, setTasksInProgress] = useState<Array<Task>>([]);
    const [tasksToDo, setTasksToDo] = useState<Array<Task>>([]);
    const [tasksCompleted, setTasksCompleted] = useState<Array<Task>>([]);
    const [tasksEmergency, setTasksEmergency] = useState<Array<Task>>([]);
    const [selectedTaskId, setSelectedTaskId] = useState<string>(''); // Stores ID of selected task (or subtask)
    const [selectedTask, setSelectedTask] = useState<Task>();
    const [selectedTaskParent, setSelectedTaskParent] = useState<Task>(); // Stores parent task of selected subtask
    const [editMode, setEditMode] = useState<boolean>(false);
    const [nextId, setNextId] = useState(100); // Initial counter value

    const { sendMessage, lastMessage } = useDynamicWebSocket({
      type: 'TASK_LIST'
    });

    const generateUniqueId = () => {
      setNextId((prevId) => prevId + 1);
      return nextId;
    };

    
    // ------------------------------------------------------------------------
    //                      Initalize tasks (todo: status??)
    // ------------------------------------------------------------------------
    useEffect(() => {
        // Declare a boolean flag that we can use to cancel the API request.
        console.log("initializing tasks");
        setTasksToDo(dummyTasks);
        setSelectedTask(dummyTasks[0]);
        setSelectedTaskId(dummyTasks[0].id.toString());
        // let ignoreStaleRequest = false;
    
        // // Call api to get initial list of all tasks
        // fetch('/api/getTasks/', { credentials: "same-origin" })  // FIXME: url for getting tasks?
        //   .then((response) => {
        //     if (!response.ok) throw Error(response.statusText);
        //     return response.json();
        //   })
        //   .then((tasks) => {
        //     if (!ignoreStaleRequest) {
        //       // FIXME: how to determine which tasks are initially in progress or emergency?
        //       setTasksToDo(tasks.filter((t) => t.status === 0))
        //       setTasksCompleted(tasks.filter((t) => t.status === 1))
        //     }
        //   })
        //   .catch((error) => console.log(error));
    
        // return () => {
        //   ignoreStaleRequest = true;
        // };
      }, []);


    // ------------------------------------------------------------------------
    // Highlight Task on Click
    // ------------------------------------------------------------------------

    const handleTaskClick = (task) => {
      // Deselect any previously selected task/subtask
      setSelectedTaskId('');
  
      // Update selected state for the clicked task
      setSelectedTaskId(task.id);
      setSelectedTask(task);
      setSelectedTaskParent(undefined);
      setEditMode(false);
    };
  
    const handleSubtaskClick = (subtask, parentTask) => {
      // Deselect any previously selected task/subtask
      setSelectedTaskId('');
  
      // Update selected state for the clicked subtask (considering parent)
      setSelectedTaskId(`${parentTask.id}-${subtask.id}`); // Combine parent and subtask ID
      setSelectedTask(subtask);
      setSelectedTaskParent(parentTask);
      setEditMode(false);
      
    };
  
    // ------------------------------------------------------------------------
    //                              Complete Task Handler
    // ------------------------------------------------------------------------
    function handleTaskComplete(event, taskID, taskStatus) {
        if (taskStatus >= 3) {
          return;
        }
        // split taskID into task and subtask IDs
        // find task in array add it to completed and remove it from in progress
        if (taskStatus === TaskStatus.INPROGRESS) {
          // set task status to completed
          const task = tasksInProgress.find((t) => t.id === taskID);
          if (task) {
            task.status = TaskStatus.COMPLETED;
            setTasksCompleted([...tasksCompleted, task]);
            setTasksInProgress(tasksInProgress.filter((t) => t.id !== taskID));
          }
        }
        else if (taskStatus === TaskStatus.TODO) {
          const task = tasksToDo.find((t) => t.id === taskID);
          if (task) {
            task.status = TaskStatus.COMPLETED;
            setTasksCompleted([...tasksCompleted, task]);
            setTasksToDo(tasksToDo.filter((t) => t.id !== taskID));
          }
        }
        else if (taskStatus === TaskStatus.EMERGENCY) {
          const task = tasksEmergency.find((t) => t.id === taskID);
          if (task) {
            task.status = TaskStatus.COMPLETED;
            setTasksCompleted([...tasksCompleted, task]);
            setTasksEmergency(tasksEmergency.filter((t) => t.id !== taskID));
          }
        }
        sendToAR();
    }

    // ------------------------------------------------------------------------
    //                              Uncomplete Task Handler
    // ------------------------------------------------------------------------
    function handleTaskUncomplete(event, taskID, taskStatus) {
        if (taskStatus < 3) {
          return;
        }
        // find task in array add it to in progress and remove it from completed
        if (taskStatus === TaskStatus.COMPLETED) {
          // set task status to in progress
          const task = tasksCompleted.find((t) => t.id === taskID);
          if (task) {
            task.status = TaskStatus.TODO;
            setTasksToDo([task, ...tasksToDo]);
            setTasksCompleted(tasksCompleted.filter((t) => t.id !== taskID));
          }
        }
        sendToAR();
    }

    // ------------------------------------------------------------------------
    //                              Edit Task Handler
    // ------------------------------------------------------------------------
    function handleTaskEdit(event, taskID, taskStatus, task) {
        // split taskID into task and subtask IDs
        let [task_id, subtask_id] = String(taskID).split('-');
        console.log(taskID);
        // set bool if subtask
        let subtask = Boolean(subtask_id ? true : false);
        console.log(subtask);
        console.log({ taskStatus });
        console.log({ selectedTaskParent })
        // find task in array and update it
        if (taskStatus == TaskStatus.COMPLETED) {
          const taskIndex = tasksCompleted.findIndex((t) => t.id === Number(task_id));
          if (subtask) {
            const subtaskIndex = tasksCompleted[taskIndex].subtasks!.findIndex((s) => s.id === Number(subtask_id));
            if (subtaskIndex !== -1) {
              tasksCompleted[taskIndex].subtasks![subtaskIndex] = task;
            }
          }
          else {
            if (taskIndex !== -1) {
              tasksCompleted[taskIndex] = task;
            }
          }
          setTasksCompleted([...tasksCompleted]);
        }
        else if (taskStatus == TaskStatus.INPROGRESS) {
          const taskIndex = tasksInProgress.findIndex((t) => t.id === Number(task_id));
          if (subtask) {
            const subtaskIndex = tasksInProgress[taskIndex].subtasks!.findIndex((s) => s.id === Number(subtask_id));
            if (subtaskIndex !== -1) {
              tasksInProgress[taskIndex].subtasks![subtaskIndex] = task;
            }
          }
          else {
            if (taskIndex !== -1) {
              tasksInProgress[taskIndex] = task;
            }
          }
          setTasksInProgress([...tasksInProgress]);
        }
        else if (taskStatus == TaskStatus.TODO) {
          const taskIndex = tasksToDo.findIndex((t) => t.id === Number(task_id));
          if (subtask) {
            const subtaskIndex = tasksToDo[taskIndex].subtasks!.findIndex((s) => s.id === Number(subtask_id));
            if (subtaskIndex !== -1) {
              tasksToDo[taskIndex].subtasks![subtaskIndex] = task;
            }
          }
          else {
            if (taskIndex !== -1) {
              tasksToDo[taskIndex] = task;
            }
          }
          setTasksToDo([...tasksToDo]);
        }
        else if (taskStatus == TaskStatus.EMERGENCY) {
          const taskIndex = tasksEmergency.findIndex((t) => t.id === Number(task_id));
          if (subtask) {
            const subtaskIndex = tasksEmergency[taskIndex].subtasks!.findIndex((s) => s.id === Number(subtask_id));
            if (subtaskIndex !== -1) {
              tasksEmergency[taskIndex].subtasks![subtaskIndex] = task;
            }
          }
          else {
            if (taskIndex !== -1) {
              tasksEmergency[taskIndex] = task;
            }
          }
          setTasksEmergency([...tasksEmergency]);
        }
        setEditMode(false);

        sendToAR();
    }

    // ------------------------------------------------------------------------
    //                              Add Task Handler
    // ------------------------------------------------------------------------
    function handleNewTask(event) {
        // add task to array
        const task = {
          id: generateUniqueId(),
          subtask: false,
          title: "New Task",
          description: "New Task Description",
          status: TaskStatus.TODO,
          astronauts: [],
          subtasks: [],
        };
        setTasksToDo([...tasksToDo, task]);

        sendToAR();
    }

    // ------------------------------------------------------------------------
    //                          Make Emergency Handler
    // ------------------------------------------------------------------------
     function handleEmergencyTask(event, taskID, taskStatus) {
        // find task in array and update it
        if (taskStatus == TaskStatus.COMPLETED) {
          const taskIndex = tasksCompleted.findIndex((t) => t.id === taskID);
          if (taskIndex !== -1) {
            tasksCompleted[taskIndex].status = TaskStatus.EMERGENCY;
            setTasksEmergency([...tasksEmergency, tasksCompleted[taskIndex]]);
            setTasksCompleted(tasksCompleted.filter((t) => t.id !== taskID));
          }
        }
        else if (taskStatus == TaskStatus.INPROGRESS) {
          const taskIndex = tasksInProgress.findIndex((t) => t.id === taskID);
          if (taskIndex !== -1) {
            tasksInProgress[taskIndex].status = TaskStatus.EMERGENCY;
            setTasksEmergency([...tasksEmergency, tasksInProgress[taskIndex]]);
            setTasksInProgress(tasksInProgress.filter((t) => t.id !== taskID));
          }
        }
        else if (taskStatus == TaskStatus.TODO) {
          const taskIndex = tasksToDo.findIndex((t) => t.id === taskID);
          if (taskIndex !== -1) {
            tasksToDo[taskIndex].status = TaskStatus.EMERGENCY;
            setTasksEmergency([...tasksEmergency, tasksToDo[taskIndex]]);
            setTasksToDo(tasksToDo.filter((t) => t.id !== taskID));
          }
        }
        sendToAR();
      }

    // ------------------------------------------------------------------------
    //                          Handle In-Progress Handler
    // ------------------------------------------------------------------------
    function handleInProgressTask(event, taskID, taskStatus) {
        // find task in array and update it
        if (taskStatus == TaskStatus.COMPLETED) {
          const taskIndex = tasksCompleted.findIndex((t) => t.id === taskID);
          if (taskIndex !== -1) {
            tasksCompleted[taskIndex].status = TaskStatus.INPROGRESS;
            setTasksInProgress([...tasksInProgress, tasksCompleted[taskIndex]]);
            setTasksCompleted(tasksCompleted.filter((t) => t.id !== taskID));
          }
        }
        else if (taskStatus == TaskStatus.TODO) {
          const taskIndex = tasksToDo.findIndex((t) => t.id === taskID);
          if (taskIndex !== -1) {
            tasksToDo[taskIndex].status = TaskStatus.INPROGRESS;
            setTasksInProgress([...tasksInProgress, tasksToDo[taskIndex]]);
            setTasksToDo(tasksToDo.filter((t) => t.id !== taskID));
          }
        }
        else if (taskStatus == TaskStatus.EMERGENCY) {
          const taskIndex = tasksEmergency.findIndex((t) => t.id === taskID);
          if (taskIndex !== -1) {
            tasksEmergency[taskIndex].status = TaskStatus.INPROGRESS;
            setTasksInProgress([...tasksInProgress, tasksEmergency[taskIndex]]);
            setTasksEmergency(tasksEmergency.filter((t) => t.id !== taskID));
          }
        }
        sendToAR();
      }
    
    // ------------------------------------------------------------------------
    //                          Add Subtask Handler
    // ------------------------------------------------------------------------
    function handleAddSubtask(event, taskID, taskStatus) {
        if (taskStatus === TaskStatus.COMPLETED || taskStatus === TaskStatus.EMERGENCY) {
          return;
        }
        // check if - in taskID
        const [task_id, subtask_id] = taskID.split('-');
        if (subtask_id) {
          return;
        }
        console.log(taskID);
        // Create a new subtask
        const subtask = {
          id: generateUniqueId(),
          subtask: true,
          title: "New Subtask",
          description: "New Subtask Description",
          status: TaskStatus.TODO,
          astronauts: [],
        };
        // Find task in array and add subtask to it
        if (taskStatus === TaskStatus.INPROGRESS) {
          console.log("adding subtask to in progress");
          const taskIndex = tasksInProgress.findIndex((t) => t.id === Number(taskID));
          if (taskIndex !== -1) {
            console.log("found task");
            const updatedTasksInProgress = [...tasksInProgress]; // Create a copy of the array
            updatedTasksInProgress[taskIndex].subtasks = updatedTasksInProgress[taskIndex].subtasks ?? []; // Ensure subtasks exist
            updatedTasksInProgress[taskIndex].subtasks!.push(subtask); // Push the new subtask
            setTasksInProgress(updatedTasksInProgress); // Update state using the new array
          }
        } else if (taskStatus === TaskStatus.TODO) {
          console.log("adding subtask to todo");
          const taskIndex = tasksToDo.findIndex((t) => t.id === Number(taskID));
          if (taskIndex !== -1) {
            console.log("found task");
            const updatedTasksToDo = [...tasksToDo]; // Create a copy of the array
            updatedTasksToDo[taskIndex].subtasks = updatedTasksToDo[taskIndex].subtasks ?? []; // Ensure subtasks exist
            updatedTasksToDo[taskIndex].subtasks!.push(subtask); // Push the new subtask
            setTasksToDo(updatedTasksToDo); // Update state using the new array
          }
        }
        sendToAR();
      }
        

    // ------------------------------------------------------------------------
    //                          Complete Subtask Handler
    // ------------------------------------------------------------------------
    function handleToggleCompleteSubtask(event, task_id, subtask_id, taskStatus) {
      // split taskID into task and subtask IDs
      // find task in array and set status to completed
      if (taskStatus === TaskStatus.INPROGRESS) {
        const taskIndex = tasksInProgress.findIndex((t) => t.id === Number(task_id));
        if (taskIndex !== -1) {
          const subtaskIndex = tasksInProgress[taskIndex].subtasks!.findIndex((s) => s.id === Number(subtask_id));
          if (subtaskIndex !== -1) {
            if (tasksInProgress[taskIndex].subtasks![subtaskIndex].status === TaskStatus.COMPLETED) {
              tasksInProgress[taskIndex].subtasks![subtaskIndex].status = TaskStatus.TODO;
            }
            else {
              tasksInProgress[taskIndex].subtasks![subtaskIndex].status = TaskStatus.COMPLETED;
            }
            setTasksInProgress([...tasksInProgress]);
          }
        }
      }
      else if (taskStatus === TaskStatus.TODO) {
        const taskIndex = tasksToDo.findIndex((t) => t.id === Number(task_id));
        if (taskIndex !== -1) {
          const subtaskIndex = tasksToDo[taskIndex].subtasks!.findIndex((s) => s.id === Number(subtask_id));
          if (subtaskIndex !== -1) {
            if (tasksToDo[taskIndex].subtasks![subtaskIndex].status === TaskStatus.COMPLETED) {
              tasksToDo[taskIndex].subtasks![subtaskIndex].status = TaskStatus.TODO;
            }
            else {
              tasksToDo[taskIndex].subtasks![subtaskIndex].status = TaskStatus.COMPLETED;
            }
            setTasksToDo([...tasksToDo]);
          }
        }
      }
      sendToAR();
    }
    // ------------------------------------------------------------------------
    //                              Convert to JSON
    // ------------------------------------------------------------------------
    function sendToAR() {
      sendMessage(JSON.stringify({ type: 'TASKLIST_FOR_AR', data: convertToTargetTypes(tasksEmergency.concat(tasksCompleted).concat(tasksInProgress).concat(tasksToDo))}));
    }
    // ------------------------------------------------------------------------
    //                              Convert to AR JSON
    // ------------------------------------------------------------------------
    function convertToTargetTypes(data) {
      // Helper function to convert status
      function convertStatus(status) {
        switch(status) {
          case TaskStatus.TODO: return 0;
          case TaskStatus.INPROGRESS: return 1;
          case TaskStatus.COMPLETED: return 2;
          default: return 0;
        }
      }
  
      function convertTasks(tasks) {
        return tasks.map(task => ({
          id: task.task_id,
          title: task.title,
          description: task.description,
          status: convertStatus(task.status),
          astronauts: [],
          subtasks: task.subtasks ? convertTasks(task.subtasks) : [],
          isEmergency: task.status === TaskStatus.EMERGENCY,
        }));
      }
    
      // Convert the main task list data
      const convertedTasks = convertTasks(data.AllTasks);
    
      return {
        tasks: convertedTasks
      };
    }

    // ------------------------------------------------------------------------
    //                              Convert from AR JSON
    // ------------------------------------------------------------------------

    function convertFromTargetTypes(data: any): Task[] {
      // Helper function to convert status from C# to JavaScript
      function convertStatus(status: number): TaskStatus {
        if (data.isEmergency) {
          return TaskStatus.EMERGENCY;
        }
        switch (status) {
          case 0: return TaskStatus.INPROGRESS;
          case 1: return TaskStatus.TODO;
          case 2: return TaskStatus.COMPLETED;
          default: return TaskStatus.TODO;
        }
      }
    
      // Helper function to convert tasks from C# to JavaScript
      function convertTasks(tasks: any[]): Task[] {
        return tasks.map(task => ({
          id: task.task_id,
          subtask: task.subtask.length > 0,
          title: task.title,
          description: task.description,
          status: convertStatus(task.status),
          astronauts: [],
          subtasks: task.subtasks ? convertTasks(task.subtasks) : []
        }));
      }
    
      // Convert the main task list data
      const convertedTasks = convertTasks(data.AllTasks);
    
      return convertedTasks;
    }

    // ------------------------------------------------------------------------
    //                                   Render
    // ------------------------------------------------------------------------
    return (
        <div className='task-background'>
          <div className='task-list'>
            <div className='task-list-header'>
              <div className='task-list-header-left'>
                <h3>Tasks</h3>
              </div>
              <div className='task-list-header-center'>
                <p className='task-ratio'>{`${tasksCompleted.length}/${tasksInProgress.length + tasksToDo.length + tasksCompleted.length + tasksEmergency.length}`}</p>
                <ProgressBar progress={Math.min((tasksCompleted.length / (tasksInProgress.length + tasksToDo.length + tasksCompleted.length + tasksEmergency.length)) * 100, 100)} />
              </div>
              <div className='task-list-header-right'>
                <button className='add-task-button' onClick={handleNewTask}>Add Task</button>
              </div>
            </div>

            <div className='task-list-items'>
              {tasksEmergency.length !== 0 && ( // Conditional rendering with clear check
                <div className='emergency-tasks'>
              {tasksEmergency.map((task) => (
                      <div key={task.id}>
                        <div
                          className={`emergency-task-list-item ${(`${task.id}`) == selectedTaskId ? 'selected' : ''}`}
                          onClick={() => handleTaskClick(task)}
                        >
                          <label htmlFor={`task-${task.id}`}>
                            <input type="checkbox" id={`task-${task.id}`} onClick={() => handleTaskComplete(null, task.id, TaskStatus.EMERGENCY)}/>
                          </label>
                          <div className="task-content">
                            <span className="task-text">{task.title}</span>
                            <p className="task-description">{task.description}</p>
                          </div>
                        </div>
                        {task.subtasks && task.subtask && ( // Check if subtasks exist
                          <div className="emergency-subtasks-container"> {/* Wrap subtasks */}
                            {task.subtasks.map((subtask) => (
                              <div 
                              key={subtask.id} 
                              className={`subtask ${(`${task.id}-${subtask.id}`) == selectedTaskId ? 'selected' : ''}`}
                              onClick={() => handleSubtaskClick(subtask, task)}>
                                <label htmlFor={`subtask-${subtask.id}`}> {/* Update ID format */}
                                  <input type="checkbox" id={`subtask-${subtask.id}`} />
                                </label>
                                <div className="task-content">
                                  <span className="task-text">{subtask.title}</span>
                                  <p className="task-description">{subtask.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}  
            </div>
              )}

            {tasksCompleted.map((task) => (
                    <div key={task.id}>
                      <div
                        className={`task-list-item ${(`${task.id}`) == selectedTaskId ? 'selected' : ''}`}
                        onClick={() => handleTaskClick(task)}
                      >
                        <label htmlFor={`task-${task.id}`}>
                          <input type="checkbox" id={`task-${task.id}`} checked={true} onClick={() => handleTaskUncomplete(null, task.id, TaskStatus.COMPLETED)}/>
                        </label>
                        <div className="task-content">
                          <span className="task-text">{task.title}</span>
                          <p className="task-description">{task.description}</p>
                        </div>
                      </div>
                      {task.subtasks && task.subtask && ( // Check if subtasks exist
                        <div className="subtasks-container"> {/* Wrap subtasks */}
                          {task.subtasks.map((subtask) => (
                            <div 
                            key={subtask.id} 
                            className={`subtask ${(`${task.id}-${subtask.id}`) == selectedTaskId ? 'selected' : ''}`}
                            onClick={() => handleSubtaskClick(subtask, task)}>
                              <label htmlFor={`subtask-${subtask.id}`}> {/* Update ID format */}
                                <input type="checkbox" id={`subtask-${subtask.id}`} checked={true} />
                              </label>
                              <div className="task-content">
                                <span className="task-text">{subtask.title}</span>
                                <p className="task-description">{subtask.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

            {tasksInProgress.map((task) => (
                    <div key={task.id}>
                      <div
                        className={`inprogress-task-list-item ${(`${task.id}`) == selectedTaskId ? 'selected' : ''}`}
                        onClick={() => handleTaskClick(task)}
                      >
                        <label htmlFor={`task-${task.id}`}>
                          <input type="checkbox" onClick={() => handleTaskComplete(null, task.id, TaskStatus.INPROGRESS)} id={`task-${task.id}`} />
                        </label>
                        <div className="task-content">
                          <span className="task-text">{task.title}</span>
                          <p className="task-description">{task.description}</p>
                        </div>
                      </div>
                      {task.subtasks && task.subtask && ( // Check if subtasks exist
                        <div className="subtasks-container"> {/* Wrap subtasks */}
                          {task.subtasks.map((subtask) => (
                            <div 
                            key={subtask.id} 
                            className={`subtask ${(`${task.id}-${subtask.id}`) == selectedTaskId ? 'selected' : ''}`}
                            onClick={() => handleSubtaskClick(subtask, task)}>
                              <label htmlFor={`subtask-${subtask.id}`}> {/* Update ID format */}
                                <input onClick={() => handleToggleCompleteSubtask(null, task.id, subtask.id, task.status)} type="checkbox" id={`subtask-${subtask.id}`} checked={subtask.status === TaskStatus.COMPLETED} />
                              </label>
                              <div className="task-content">
                                <span className="task-text">{subtask.title}</span>
                                <p className="task-description">{subtask.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

            {tasksToDo.map((task) => (
                    <div key={task.id}>
                      <div
                        className={`task-list-item ${(`${task.id}`) == selectedTaskId ? 'selected' : ''}`}
                        onClick={() => handleTaskClick(task)}
                      >
                        <label htmlFor={`task-${task.id}`}>
                          <input type="checkbox" onClick={() => handleTaskComplete(null, task.id, TaskStatus.TODO)} id={`task-${task.id}`} />
                        </label>
                        <div className="task-content">
                          <span className="task-text">{task.title}</span>
                          <p className="task-description">{task.description}</p>
                        </div>
                      </div>
                      {task.subtasks && task.subtask && ( // Check if subtasks exist
                        <div className="subtasks-container"> {/* Wrap subtasks */}
                          {task.subtasks.map((subtask) => (
                            <div 
                            key={subtask.id} 
                            className={`subtask ${(`${task.id}-${subtask.id}`) == selectedTaskId ? 'selected' : ''}`}
                            onClick={() => handleSubtaskClick(subtask, task)}>
                              <label htmlFor={`subtask-${subtask.id}`}> {/* Update ID format */}
                                <input onClick={() => handleToggleCompleteSubtask(null, task.id, subtask.id, task.status)} type="checkbox" id={`subtask-${subtask.id}`} checked={subtask.status === TaskStatus.COMPLETED} />
                              </label>
                              <div className="task-content">
                                <span className="task-text">{subtask.title}</span>
                                <p className="task-description">{subtask.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>

          <div className='task-details'>
              {/*render the this only if there is currently a selected task*/}
              {selectedTask && (
                <div>
                  <div className='task-details-header'>
                    {!editMode && (<p className='task-details-name'>{selectedTask.title}</p>)}
                    {editMode && (<TitleForm task={selectedTask} onTaskChange={setSelectedTask}/>)}
                    <button className='inprogress-details-button' onClick={() => handleInProgressTask(null, selectedTaskId, selectedTask.status)}>In-Progress</button>
                    <button className='subtask-details-button' onClick={() => handleAddSubtask(null, String(selectedTaskId), selectedTask.status)}>Subtask</button>
                    <button className='emergency-details-button' onClick={() => handleEmergencyTask(null, selectedTaskId, selectedTask.status)}></button>
                    <button className='edit-details-button' onClick={() => setEditMode(true)}>Edit</button>
                    <button className='delete-details-button' onClick={handleNewTask}></button>
                  </div>
                    {!editMode && (
                      <div className='task-details-description'>
                        <p>{selectedTask.description}</p>
                      </div>
                    )}
                    {editMode && (
                      <div>
                        <DescriptionForm task={selectedTask} onTaskChange={setSelectedTask} />
                        <div className='task-details-bottom'>
                          <div className='spacer' />
                          <button className='save-details-button' onClick={() => { handleTaskEdit(null, selectedTaskId, selectedTaskParent?.status ?? selectedTask.status, selectedTask) }}>Save Details</button>
                          <button className='cancel-details-button' onClick={() => { setEditMode(false) }}>Cancel</button>
                        </div>
                      </div>
                    )}
                </div>
              )}
          </div>



        </div>
    );
}