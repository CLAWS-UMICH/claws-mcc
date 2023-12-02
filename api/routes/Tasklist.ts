import { Request, Response, Router } from "express";
import Base from "../Base";
import { ObjectId } from "mongodb";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";



//astronaut object
export type Astronaut = {
	_id: number; //replace with ObjectId eventually
	name: string;

}

const astronauts: Astronaut[] = [
	{
		_id: 0 ,
		name: "Astronaut 1",
	  },
	{
		_id: 1,
		name: "Astronaut 2",
	},
	{
		_id: 2,
		name: "Astronaut 3",
	},
]
export type Task = {
	id: number; //eventually replace with ObjectId
	title: string;
	description: string;
	status: number;
	astronauts: [];
	subtasks: [];
}

const Task1: Task={
	
	id: 0,
	title: 'Task1',
	description: 'The first task of the mock',
	status: 1, //completed
	astronauts: [],
	subtasks: [],

}
const Task2: Task = {
	
	id: 1,
	title: 'Task2',
	description: 'The second task of the mock',
	status: 0, //in progress
	astronauts: [],
	subtasks: [],
	
}


//this is mock data?
// const tasks: Task[] = [
// 	Task1, Task2
// ]



export default class Tasklist extends Base {


	//list of tasks
	private tasks: Task[];
	//create th task list table inside of the database
	mongoTask(){
		
			this.db.createCollection('tasks');
			console.log("Tasks table created");
		
	}
	constructor(){

		super();
		if (this.db.collection('tasks').find() == null){
			this.mongoTask();
		}
		
		this.db.collection('tasks').find().toArray().then((res)=>{
		this.tasks = res as unknown as Task[];
		});
		
	}

	// NOTE: we don't need to write GET

	//route to add a task
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

	//getting the Task list for a specific astronaut
	addTask(req: Request, res: Response) {
		//there is no task id for this, we have to generate it in the backend
		const newTask = req.body as Task;
		const length = this.tasks.length;

		newTask.id = length;
		this.tasks.push(newTask);

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
		}
		
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
		}

		return res.status(204).send(`Task ${key} deleted`);
	}


}