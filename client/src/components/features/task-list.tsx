import React, { useEffect, useState } from 'react';
// import CheckBox from '../common/CheckBox/CheckBox';

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

export function TaskList() {
    // FIXME! might not actually need separate variables for these but need to decide how to 
    // differentiate in progress, to-do, completed, and emergency tasks
    const [tasksInProgress, setTasksInProgress] = useState<Array<Task>>([]);
    const [tasksToDo, setTasksToDo] = useState<Array<Task>>([]);
    const [tasksCompleted, setTasksCompleted] = useState<Array<Task>>([]);
    const [tasksEmergency, setTasksEmergency] = useState<Array<Task>>([]);
    
    // ------------------------------------------------------------------------
    //                      Initalize tasks (todo: status??)
    // ------------------------------------------------------------------------
    useEffect(() => {
        // Declare a boolean flag that we can use to cancel the API request.
        let ignoreStaleRequest = false;
    
        // Call api to get initial list of all tasks
        fetch('/api/getTasks/', { credentials: "same-origin" })  // FIXME: url for getting tasks?
          .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
          })
          .then((tasks) => {
            if (!ignoreStaleRequest) {
              // FIXME: how to determine which tasks are initially in progress or emergency?
              setTasksToDo(tasks.filter((t) => t.status === 0))
              setTasksCompleted(tasks.filter((t) => t.status === 1))
            }
          })
          .catch((error) => console.log(error));
    
        return () => {
          ignoreStaleRequest = true;
        };
      }, []);

    // ------------------------------------------------------------------------
    //                              Remove Task Handler
    // ------------------------------------------------------------------------
      // when do we actually want to delete tasks?

      // FIXME: !!! how should we keep track of tasks in progress, completed, to-do, etc??
      function handleTaskDelete(event, task){
        console.log("task finished")
        if (task.status === 1) {
            console.log("task already done");
            return;
        }
          try {
            // Make a delete request to remove the task (and move this task to the completed)
            const response = fetch(`/api/deleteTask/:${task.id}`, {
              method: "DELETE",
            });
            response.then(() => {
                // remove from in progress task array??
              setTasksInProgress(
                tasksInProgress.filter((t) => t.id !== task.id)
              );
              // append to completed tasks array?? might actually do this in updateTask instead!
              setTasksCompleted([...tasksCompleted, task]);
            });
          } catch (error) {
            console.error("Error while deleting task", error);
          }
      }


    // ------------------------------------------------------------------------
    //                              Add Task Handler
    // ------------------------------------------------------------------------

    // these will be updated on change to form (not implemented yet)
    const [newTitle, setNewTitle] = useState("")
    const [newDescription, setNewDescription] = useState("")
    const [newAstronauts, setNewAstronauts] = useState<Array<string>>([]) // fixme: syntax
    // FIXME: add logic for subtasks

    const updateTitle = (e) => {
        setNewTitle(e.target.value);
    };
    const updateDescription = (e) => {
        setNewDescription(e.target.value);
    };
    const updateAstronauts = (e) => {
        setNewAstronauts([...newAstronauts, e.target.value]);
    };

    // event will probably be onclick for a submit button, possibly enter keydown
    function handleNewTask(event){
        console.log("adding new task")
          fetch(`/api/addTask/`, {
            method: "POST",
            body: JSON.stringify({title: newTitle, 
                                  description: newDescription, 
                                  astronauts: newAstronauts }),
            credentials: "same-origin",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            // assuming it returns the new task object
            .then((response) => response.json())
            .then((addedTask) => {
                // FIXME: the array it goes in will depend on status so need that logic
              setTasksToDo([...tasksToDo, addedTask]);
              // Clear the variables
              setNewTitle("");
              setNewDescription("")
              setNewAstronauts([])
            });
    }

    // ------------------------------------------------------------------------
    //                              Update Task Handler
    // ------------------------------------------------------------------------
      // when do we actually want to update tasks? like status changes?

      // FIXME: for now im assuming we only change the status but can add more later
      function handleTaskUpdate(event, task){
        console.log(`updating task ${task.id}`)
        task.status === 1 ? task.status = 0 : task.status = 1; // for now just flip status
          try {
            // Make a put request to update the task
            const response = fetch(`/api/updateTask/:${task.id}`, {
              method: "PUT",
              body: JSON.stringify(task),
              credentials: "same-origin",
              headers: {
              "Content-type": "application/json; charset=UTF-8",},
            });
            response.then(() => {
                // do stuff
            });
          } catch (error) {
            console.error("Error while deleting task", error);
          }
      }

    // ------------------------------------------------------------------------
    //                              Test/Debug
    // ------------------------------------------------------------------------
    // Mock
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

    // ------------------------------------------------------------------------
    //                          (Very rough draft) Render
    // ------------------------------------------------------------------------
    return (
        <div>
            <h3>Tasks</h3>

            {/* show forms on click */}
            <button>New Task</button> 

            {/* FIXME: make groups of tasks into separate component */}
            <p>In progress
            {tasksInProgress.map(task => (
            <li key={task.id}>
                {/* <CheckBox onChange={(e) => handleTaskFinished(e, task)}/> */}
                <p>{task.title}</p>
                <p>{task.description}</p>
                {task.subtasks.map(subtask => (
                    // <subtask info>
                    // <CheckBox/>
                    subtask // do something to nicely display subtask
                )
                )}
            </li>
            ))}
            </p>
            
        
            <p>Emergency</p>

            <p>To-do</p>

            <p>Completed</p>


        </div>
    );
}