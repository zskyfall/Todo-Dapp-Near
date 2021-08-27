import { Context, PersistentVector, logging, storage, env } from 'near-sdk-as'
import { Task, tasks } from './model';

const DEFAULT_MESSAGE = 'Hello'

/**
 * Get task from index
 * @param index Index of task 
 * @returns Return a task or null
 */
 export function getTask(tskId: i32): Task | null {
  // Checking msgIndex
  let index = tskId - 1;
  if (index<0 || index>=tasks.length) {
      // Invalid input
      return null
  };

  // Return tasks
  return tasks[index];
}

export function getTasksByAccountId(_accountId: String) : Task[] {
  let results = new Array<Task>();

  for(let i = 0; i < tasks.length; i ++) {
    let accountId = tasks[i].accountId;
    if(accountId == _accountId) {
      results.push(tasks[i]);
    }
  }
  return results;
}

export function getAllTasks() : void {

  logging.log(tasks);

}

/**
 * Adds new task to contex.sender account.
 * NOTE: This is a change method. Which means it will modify the state.
 * @param _author Author of the task
 * @param _content Content of the task
 */
 export function addNewTask(_author: string, _content: string): void {

  // Store new task into blockchain
  let accountId = Context.sender;
  if (accountId == _author) {
      // Don't allow sender to yourself
      return;
  }
  let tskId = tasks.length + 1;
  let tsk = new Task(tskId, _author, accountId, _content, '', false);
  let index = tasks.push(tsk);
  logging.log(tsk);
}

//Mark a task is Completed or not
export function toggleTaskDone(_taskId: i32) : bool {
  for(let i = 0; i < tasks.length; i ++) {
    let taskId = tasks[i].id;

    if(taskId == _taskId) {
      let author = tasks[i].author;
      let content = tasks[i].content;
      let timestamp = tasks[i].timestamp;
      let accountId = tasks[i].accountId;

      let replaceTask = new Task(taskId, author, accountId, content, '', !tasks[i].isDone);
      tasks.replace(i, replaceTask);
      return tasks[i].isDone;
    }
  }
  return false;
}

