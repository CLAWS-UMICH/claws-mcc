import { Request, Response, Router } from "express";
import Base from "../Base";
import { ObjectId } from "mongodb";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { Platform } from "../Base";



//astronaut object
export type Astronaut = {
	astronaut_id: number; //replace with ObjectId eventually
	ready: boolean;
}

// const astronauts: Astronaut[] = [
// 	{
// 		_id: 0 ,
// 		name: "Astronaut 1",
// 	  },
// 	{
// 		_id: 1,
// 		name: "Astronaut 2",
// 	},
// ]

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

// const Task1: Task={
	
// 	id: 0,
// 	title: 'Task1',
// 	description: 'The first task of the mock',
// 	status: 1, //completed
// 	astronauts: [],
// 	subtasks: [],

// }




export default class Tasklist extends Base {


	//list of tasks
	private tasks: Task[];
	//create th task list table inside of the database
	
	constructor(){

		super();
		
		// if we restart the application, the collection tasks will be storing values 
		this.refreshTasks();
		
	}

	async refreshTasks() {
		const res = await this.db.collection('tasks').find().toArray();
			
		this.tasks = res as unknown as Task[];
	}

	//route to add a task
	// TODO: Use PUT for dispatch() 
	/*
		When sending data (even if you are deleting, editing, or creating 
			a new task for this example) always use PUT as the use
	*/
	public routes = [
		{
			path: '/api/addTask/',
			method: 'post',
			handler: this.addTask.bind(this),
		},
		{
			path: '/api/updateTask/:id',
			method: 'put',
			handler: this.updateTask.bind(this),

		},
		{
			path: '/api/deleteTask/:id',
			method: 'delete',
			handler: this.deleteTask.bind(this),

		},
	];

	/* Unlike HTTP, which requires a new request for every server response, 
	WebSockets maintain a persistent connection, making them ideal for realtime applications */
	/* usage on frontend: https://www.npmjs.com/package/ws#usage-examples
	github: https://github.com/websockets/ws */ 
	public events = [
		{ 
			platform: Platform.FRONTEND,
			type: 'TASK_LIST',
			handler: this.getTasks.bind(this),
		},
	]
	// **PLEASE IGNORE ** 
	//Code reference for frontend 
	// const ws = new WebSocket('ws://localhost:8000/frontend');

	// ws.on('error', console.error);

	// ws.on('open', function open() {
	// 	ws.send({ type: 'TASK_LIST' });
	// });

	// ws.on('message', function message(data) {
	// 	data = JSON.parse(data);

	//  if (data.type == 'TASK_LIST') {
	// 		setTasks(data.data);	
	// 	}
	// });

	/* NOTE: 
		Using the length of the array as the ID for new tasks can lead to issues. 
			If a task is deleted, its ID will not be in use anymore, and a new task could be assigned the same ID when it's created. 
			This could lead to confusion and bugs, as IDs are usually expected to be unique.
		As for async/await, it's not strictly necessary, but it can make your code cleaner and easier to understand, especially when dealing with promises. 
			In your current addTask method, you're using promises without async/await, which is perfectly fine. 
			However, if you have multiple asynchronous operations that depend on each other, using async/await can make your code much easier to read and maintain.
	*/
		

	// GET for web frontend
	getTasks() {
		this.dispatch("FRONTEND", {
			data: this.tasks,
			type: 'TASK_LIST',
		});
	}

	
	// TODO: add emergency property
	// TODO: add code to send to AR frontend 
	addTask(req: Request, res: Response) {
		const newTask = req.body as Task;
		const length = this.tasks.length;

		// TODO: add code to assign values to undefined properties 
		newTask.id = length;
		this.tasks.push(newTask);

		this.dispatch('AR', { 
			id: -1,
			use: 'PUT',
			type: "TaskList",
			data: {
				"AllTasks": this.tasks
			}
		})

		// update mongo 
		try {
			this.db.collection('tasks').insertOne(newTask);
			res.status(201).send('Task created successfully');
		} catch (error) {
			console.error(`Failed to insert new task: ${error.message}`);
			res.status(500).send('Failed to insert new task');
		}
	}

	//edit a task in tasks
	// TODO: add functionality to add subtask 
	async updateTask(req:Request, res:Response){
		const key: number = parseInt(req.params.id, 10); 
		if (isNaN(key)){
			//Handle the case where the conversion to number fails
			res.status(400).send('Invalid Task ID');
			return;
		}

		const newTask = req.body as Task;

		// update mongoDB
		try {
			const result = await this.db.collection('tasks').updateOne({ id: newTask.id }, { $set: newTask });
			if (result.matchedCount === 0) {
				res.status(404).send('Task not found');
			} 
		} catch (err) {
			console.error(`Failed to update task: ${err.message}`);
			return res.status(500).send('Failed to update task');
		}

		// update local task array (sync with mongoDB)
		const idx = this.tasks.findIndex(task => task.id == key);
		if(idx !== -1){
			this.tasks[idx]= newTask;
		} else {
			console.log("Task not found in local array (update), performing hard refresh")
			await this.refreshTasks();
		}

		this.dispatch('AR', { 
			id: -1,
			use: 'PUT',
			type: "TaskList",
			data: {
				"AllTasks": this.tasks
			}
		})
		
		// NOTE: do we need to send the newTask back?
		return res.status(200).json(newTask);
	}

	
	//delete a task from tasks
	async deleteTask(req:Request, res:Response){
		//key should be the task id
		const key: number = parseInt(req.params.task, 10); //convert to number
		if (isNaN(key)){
			//Handle the case where the conversion to number fails
			res.status(400).send('Invalid Task ID');
			return;
		}

		try {
			const result = await this.db.collection('tasks').deleteOne({ id: key });
			if (result.deletedCount === 0) {
				return res.status(404).send('Task not found');
			}
		} catch (error) {
			console.error(`Failed to delete task: ${error.message}`);
			return res.status(500).send('Failed to delete task');
		}

		//update local task array
		const idx = this.tasks.findIndex(t => t.id == key); // key will be the id given to us
		if (idx !== -1) { // findIndex will return -1 if task not found
			this.tasks.splice(idx, 1);
		} else {
			console.log("Task not found in local array (delete), performing hard refresh")
			await this.refreshTasks();
		}

		return res.status(204).send(`Task ${key} deleted`);
	}


}