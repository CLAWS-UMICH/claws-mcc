import { Request, Response, Router } from "express";
import Base from "../Base";
import { Db, ObjectId } from "mongodb";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import Logger from "../core/logger";

// astronaut object
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


export default class Tasklist extends Base {
	//individual task id number generator, only increases, never decreases even if tasks are completed
	private idgen: number =  0;

	//list of tasks
	private tasks: Task[];
	private logger = new Logger('TaskList');
	//create the task list table inside of the database
	
	constructor(db: Db) {
		super(db);
		
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
		{
			path: '/api/addSubtask/:id',
			method:'put',
			handler: this.addSubtask.bind(this),

		},
		{
			path:'/api/deleteSubtask/:parent_id/:child_id',
			method: 'delete',
			handler: this.deleteSubtask.bind(this),
		},
		
	];

	/* Unlike HTTP, which requires a new request for every server response, 
	WebSockets maintain a persistent connection, making them ideal for realtime applications */
	/* usage on frontend: https://www.npmjs.com/package/ws#usage-examples
	github: https://github.com/websockets/ws */ 
	public events = [
		{ 
			platform: 'FRONTEND',
			type: 'TASKLIST',
			handler: this.getTasks.bind(this),
		},
		{ 
			platform: 'FRONTEND',
			type: 'TASKLIST_FOR_AR',
			handler: this.proxyTaskList.bind(this),
		},
	]
	// **PLEASE IGNORE ** 
	//Code reference for frontend 
	// const ws = new WebSocket('ws://localhost:8000/frontend');

	// ws.on('error', console.error);

	// ws.on('open', function open() {
	// 	ws.send({ type: 'TASKLIST' });
	// });

	// ws.on('message', function message(data) {
	// 	data = JSON.parse(data);

	//  if (data.type == 'TASKLIST') {
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
	async getTasks() {
		const tasks = await this.db.collection('tasks').find().toArray();
		this.tasks = tasks as unknown as Task[];

		this.dispatch("FRONTEND", {
			id: -1,
			use: 'PUT',
			data: tasks,
			type: 'TASKLIST',
		});
	}

	proxyTaskList(data: any) {
		this.logger.info(`Received task list from AR: ${JSON.stringify(data.data.tasks)}`)
		this.dispatch("AR", {
			id: 1,
			use: 'PUT',
			data: {
				"AllTasks": data.data.tasks
			},
			type: 'TASKLIST',
		});
	}

	
	// TODO: add emergency property
	// TODO: add code to send to AR frontend 
	async addTask(req: Request, res: Response) {
		const { data: newTask } = req.body;

		// TODO: add code to assign values to undefined properties 
		const count = await this.db.collection('tasks').countDocuments();
		newTask.id = count + 1;
		this.tasks.push(newTask);

		//what is this doing??
		this.dispatch('AR', { 
			id: -1,
			use: 'PUT',
			type: "TaskList",
			data: {
				AllTasks: this.tasks
			}
		});

		// update mongo 
		try {
			await this.db.collection('tasks').insertOne(newTask);
			return res.status(201).send('Task created successfully');
		} catch (error) {
			console.error(`Failed to insert new task: ${error.message}`);
			res.status(500).send('Failed to insert new task');
		}
	}

	
	async updateTask(req:Request, res:Response){
		//key = convert task id to a number (id stays consistent)
		const key: number = parseInt(req.params.id, 10); 
		if (isNaN(key)){
			//Handle the case where the conversion to number fails
			res.status(400).send('Invalid Task ID');
			return;
		}

		const { data: newTask } = req.body;

		// update mongoDB
		try {
			const result = await this.db.collection('tasks').updateOne({ id: newTask.id }, { $set: newTask });
			if (result.matchedCount === 0) {
				return res.status(404).send('Task not found');
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

		const tasks = await this.db.collection('tasks').find().toArray();

		this.dispatch('AR', { 
			id: -1,
			use: 'PUT',
			type: "TaskList",
			data: {
				"AllTasks": tasks
			}
		})
		
		// NOTE: do we need to send the newTask back?
		return res.status(200).json(newTask);
	}

	//CHECK OVER
	async addSubtask(req:Request, res:Response){
		//ARE WE ASSUMING THAT A SUBTASK IS THE SAME AS A TASK?
		const subTask = req.body as Task;
		//generating id for the subtask
		subTask.id = this.idgen;
		this.idgen +=1;
		//change subtask bool to true
		subTask.subtask = true;
		//store id of parent task in key
		//should this already be a number?
		const key: number = parseInt(req.params.id, 10); 
		
		//find the parent task in the Tasks[] array
		try{
			const parent = this.tasks.find(task => task.id === key);
			if (parent == null){
				console.log("Parent task not found in array Tasks");
			}
			else{
				//push the subtask onto the parent task's subtask array
				if (parent.subtasks?.length) {
					parent.subtasks.push(subTask);
				}
			}
		}
		catch(err){
			console.error(`Failed to find task: ${err.message}`);
			return res.status(500).send('Failed to find task');
		}
		//HOW TO ADD THIS TASK TO MONGODB?

		//TODO: socket stuff

		// update mongo 
		try {
			//find the parent task in mongodb with key
			const currTask = await this.db.collection('tasks').findOne({ id: key });
			if (currTask) {
				currTask.subtasks?.push(subTask);

				await this.db.collection('tasks').updateOne(
					{ id: key }, 
					{ $set: { subtasks: currTask.subtasks } }
				);
			}
			res.status(200).send('Task updated successfully in mongodb');
		} catch (error) {
			console.error(`Failed to update task in mongodb: ${error.message}`);
			res.status(500).send('Failed to update task in mongodb');
		}
	}

	
	//delete a task from tasks
	async deleteTask(req:Request, res:Response){
		//key should be the task id
		const key: number = parseInt(req.params.id, 10); //convert to number
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
	async deleteSubtask(req:Request, res:Response){
		//key should be the task id
		const parent: number = parseInt(req.params.parent_id, 10); //convert to number
		const child: number = parseInt(req.params.child_id, 10);
		if (isNaN(parent) || isNaN(child)){
			//Handle the case where the conversion to number fails
			res.status(400).send('Invalid Task ID');
			return;
		}

		//TODO: socket stuff
		try {
			const currTask = await this.db.collection('tasks').findOne({ id: parent });
			if (currTask) {
				currTask.subtasks = currTask.subtasks?.filter(subtask => subtask.id !== child);

				await this.db.collection('tasks').updateOne(
					{ id: parent },
					{ $set: { subtasks: currTask.subtasks } }
				);
			}
			res.status(200).send('Subtask deleted successfully in MongoDB');
		} catch (error) {
			console.error(`Failed to delete subtask: ${error.message}`);
			return res.status(500).send('Failed to delete subtask');
		}

		// Update local task array
		const parentTask = this.tasks.find(task => task.id === parent);
		if (parentTask == null){
			console.log("Parent task not found in array Tasks");
		} else {
			if (parentTask.subtasks) {
				// Remove the subtask with the specified child id
				parentTask.subtasks = parentTask.subtasks.filter(subtask => subtask.id !== child);
			}
		}
	}


}
// import { Request, Response, Router } from "express";
// import Base from "../Base";
// import { Collection, Db, ObjectId } from "mongodb";
// import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
// import Logger from "../core/logger";

// // astronaut object
// export type Astronaut = {
// 	astronaut_id: number; //replace with ObjectId eventually
// 	ready: boolean;
// }

// export enum TaskStatus {
//     INPROGRESS = 0,
// 	TODO = 1,
// 	EMERGENCY = 2,
// 	COMPLETED = 3, 
// }

// export type Task = {
// 	id: number;
// 	subtask: boolean;
// 	title: string;
// 	description: string; 
// 	status: TaskStatus;
// 	astronauts: Astronaut[];
// 	subtasks?: Task[];
// }

// export default class Tasklist extends Base {
// 	public routes = [
// 		{
// 			path: '/api/addTask/',
// 			method: 'post',
// 			handler: this.addTask.bind(this),
// 		},
// 		{
// 			path: '/api/updateTask/:id',
// 			method: 'put',
// 			handler: this.updateTask.bind(this),

// 		},
// 		{
// 			path: '/api/deleteTask/:id',
// 			method: 'delete',
// 			handler: this.deleteTask.bind(this),

// 		},
// 		{
// 			path: '/api/addSubtask/:id',
// 			method:'put',
// 			handler: this.addSubtask.bind(this),

// 		},
// 		{
// 			path:'/api/deleteSubtask/:parent_id/:child_id',
// 			method: 'delete',
// 			handler: this.deleteSubtask.bind(this),
// 		},
// 	];
// 	public events = [
// 		{ 
// 			platform: 'FRONTEND',
// 			type: 'TASKLIST',
// 			handler: this.getTasks.bind(this),
// 		},
// 		{ 
// 			platform: 'FRONTEND',
// 			type: 'TASKLIST_FOR_AR',
// 			handler: this.proxyTaskList.bind(this),
// 		},
// 	]
// 	//individual task id number generator, only increases, never decreases even if tasks are completed
// 	private idgen: number =  0;

// 	//list of tasks
// 	private tasks: Task[];
// 	private tasksCollection: Collection<Task>;
// 	private logger = new Logger('TaskList');
// 	//create the task list table inside of the database
	
// 	constructor(db: Db, taskCollection?: Collection<Task>) {
// 		super(db);
// 		this.tasksCollection = taskCollection || db.collection<Task>('tasks');
// 		// if we restart the application, the collection tasks will be storing values 
// 		// this.refreshTasks();
		
// 	}

// 	// async refreshTasks() {
// 	// 	const res = await this.db.collection('tasks').find().toArray();
			
// 	// 	this.tasks = res as unknown as Task[];
// 	// }

// 	/* NOTE: 
// 		Using the length of the array as the ID for new tasks can lead to issues. 
// 			If a task is deleted, its ID will not be in use anymore, and a new task could be assigned the same ID when it's created. 
// 			This could lead to confusion and bugs, as IDs are usually expected to be unique.
// 		As for async/await, it's not strictly necessary, but it can make your code cleaner and easier to understand, especially when dealing with promises. 
// 			In your current addTask method, you're using promises without async/await, which is perfectly fine. 
// 			However, if you have multiple asynchronous operations that depend on each other, using async/await can make your code much easier to read and maintain.
// 	*/
	
// 	// GET for web frontend
// 	async getTasks() {
// 		this.logger.info("TASKLIST: sending tasks to frontend")

// 		const allTasks = this.tasksCollection.find();
// 		const taskData = await allTasks.toArray();

// 		this.dispatch("FRONTEND", {
// 			id: -1,
// 			type: 'TASKLIST',
// 			use: 'PUT',
// 			data: {tasks: taskData},
// 		});
// 	}

// 	async proxyTaskList(data: any) {
// 		this.logger.info(`Received task list from AR: ${JSON.stringify(data.data.tasks)}`)


// 		this.dispatch("AR", {
// 			id: 1,
// 			use: 'PUT',
// 			data: {
// 				"AllTasks": data.data.tasks
// 			},
// 			type: 'TASKLIST',
// 		});
// 	}

	
// 	// TODO: add emergency property
// 	// TODO: add code to send to AR frontend 
// 	async addTask(req: Request, res: Response) {
// 		const newTask = req.body as Task;
// 		this.logger.info("i tried")
// 		this.logger.info(newTask)

// 		// TODO: add code to assign values to undefined properties 
// 		newTask.id = this.idgen;
// 		this.idgen +=1;
// 		this.tasks.push(newTask);

// 		//what is this doing??
// 		this.dispatch('AR', { 
// 			id: -1,
// 			use: 'PUT',
// 			type: "TaskList",
// 			data: {
// 				AllTasks: this.tasks
// 			}
// 		})

// 		// update mongo 
// 		try {
// 			this.db.collection('tasks').insertOne(newTask);
// 			res.status(201).send('Task created successfully');
// 		} catch (error) {
// 			console.error(`Failed to insert new task: ${error.message}`);
// 			res.status(500).send('Failed to insert new task');
// 		}
// 	}

	
// 	async updateTask(req:Request, res:Response){
// 		//key = convert task id to a number (id stays consistent)
// 		const key: number = parseInt(req.params.id, 10); 
// 		if (isNaN(key)){
// 			//Handle the case where the conversion to number fails
// 			res.status(400).send('Invalid Task ID');
// 			return;
// 		}

// 		const newTask = req.body as Task;

// 		// update mongoDB
// 		try {
// 			const result = await this.db.collection('tasks').updateOne({ id: newTask.id }, { $set: newTask });
// 			if (result.matchedCount === 0) {
// 				res.status(404).send('Task not found');
// 			} 
// 		} catch (err) {
// 			console.error(`Failed to update task: ${err.message}`);
// 			return res.status(500).send('Failed to update task');
// 		}

// 		// update local task array (sync with mongoDB)
// 		const idx = this.tasks.findIndex(task => task.id == key);
// 		if(idx !== -1){
// 			this.tasks[idx]= newTask;
// 		} else {
// 			console.log("Task not found in local array (update), performing hard refresh")
// 			// await this.refreshTasks();
// 		}

// 		this.dispatch('AR', { 
// 			id: -1,
// 			use: 'PUT',
// 			type: "TaskList",
// 			data: {
// 				"AllTasks": this.tasks
// 			}
// 		})
		
// 		// NOTE: do we need to send the newTask back?
// 		return res.status(200).json(newTask);
// 	}

// 	//CHECK OVER
// 	async addSubtask(req:Request, res:Response){
// 		//ARE WE ASSUMING THAT A SUBTASK IS THE SAME AS A TASK?
// 		const subTask = req.body as Task;
// 		//generating id for the subtask
// 		subTask.id = this.idgen;
// 		this.idgen +=1;
// 		//change subtask bool to true
// 		subTask.subtask = true;
// 		//store id of parent task in key
// 		//should this already be a number?
// 		const key: number = parseInt(req.params.id, 10); 
		
// 		//find the parent task in the Tasks[] array
// 		try{
// 			const parent = this.tasks.find(task => task.id === key);
// 			if (parent == null){
// 				console.log("Parent task not found in array Tasks");
// 			}
// 			else{
// 				//push the subtask onto the parent task's subtask array
// 				if (parent.subtasks?.length) {
// 					parent.subtasks.push(subTask);
// 				}
// 			}
// 		}
// 		catch(err){
// 			console.error(`Failed to find task: ${err.message}`);
// 			return res.status(500).send('Failed to find task');
// 		}
// 		//HOW TO ADD THIS TASK TO MONGODB?

// 		//TODO: socket stuff

// 		// update mongo 
// 		try {
// 			//find the parent task in mongodb with key
// 			const currTask = await this.db.collection('tasks').findOne({ id: key });
// 			if (currTask) {
// 				currTask.subtasks?.push(subTask);

// 				await this.db.collection('tasks').updateOne(
// 					{ id: key }, 
// 					{ $set: { subtasks: currTask.subtasks } }
// 				);
// 			}
// 			res.status(200).send('Task updated successfully in mongodb');
// 		} catch (error) {
// 			console.error(`Failed to update task in mongodb: ${error.message}`);
// 			res.status(500).send('Failed to update task in mongodb');
// 		}
// 	}

	
// 	//delete a task from tasks
// 	async deleteTask(req:Request, res:Response){
// 		//key should be the task id
// 		const key: number = parseInt(req.params.id, 10); //convert to number
// 		if (isNaN(key)){
// 			//Handle the case where the conversion to number fails
// 			res.status(400).send('Invalid Task ID');
// 			return;
// 		}

// 		try {
// 			const result = await this.db.collection('tasks').deleteOne({ id: key });
// 			if (result.deletedCount === 0) {
// 				return res.status(404).send('Task not found');
// 			}
// 		} catch (error) {
// 			console.error(`Failed to delete task: ${error.message}`);
// 			return res.status(500).send('Failed to delete task');
// 		}

// 		//update local task array
// 		const idx = this.tasks.findIndex(t => t.id == key); // key will be the id given to us
// 		if (idx !== -1) { // findIndex will return -1 if task not found
// 			this.tasks.splice(idx, 1);
// 		} else {
// 			console.log("Task not found in local array (delete), performing hard refresh")
// 			// await this.refreshTasks();
// 		}

// 		return res.status(204).send(`Task ${key} deleted`);
// 	}
// 	async deleteSubtask(req:Request, res:Response){
// 		//key should be the task id
// 		const parent: number = parseInt(req.params.parent_id, 10); //convert to number
// 		const child: number = parseInt(req.params.child_id, 10);
// 		if (isNaN(parent) || isNaN(child)){
// 			//Handle the case where the conversion to number fails
// 			res.status(400).send('Invalid Task ID');
// 			return;
// 		}

// 		//TODO: socket stuff
// 		try {
// 			const currTask = await this.db.collection('tasks').findOne({ id: parent });
// 			if (currTask) {
// 				currTask.subtasks = currTask.subtasks?.filter(subtask => subtask.id !== child);

// 				await this.db.collection('tasks').updateOne(
// 					{ id: parent },
// 					{ $set: { subtasks: currTask.subtasks } }
// 				);
// 			}
// 			res.status(200).send('Subtask deleted successfully in MongoDB');
// 		} catch (error) {
// 			console.error(`Failed to delete subtask: ${error.message}`);
// 			return res.status(500).send('Failed to delete subtask');
// 		}

// 		// Update local task array
// 		const parentTask = this.tasks.find(task => task.id === parent);
// 		if (parentTask == null){
// 			console.log("Parent task not found in array Tasks");
// 		} else {
// 			if (parentTask.subtasks) {
// 				// Remove the subtask with the specified child id
// 				parentTask.subtasks = parentTask.subtasks.filter(subtask => subtask.id !== child);
// 			}
// 		}
// 	}


// }