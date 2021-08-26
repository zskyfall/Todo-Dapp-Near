/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, PersistentVector, logging, storage, env } from 'near-sdk-as'
import { Task, tasks } from './model';

const DEFAULT_MESSAGE = 'Hello'

/**
 * Get message from index
 * @param index Index of message 
 * @returns Return a message or null
 */
 export function getTask(tskId: i32): Task | null {
  // Checking msgIndex
  let index = tskId - 1;
  if (index<0 || index>=tasks.length) {
      // Invalid input
      return null
  };

  // Return message
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
 * @param author Author of the task
 * @param content Content of the task
 */
 export function addNewTask(author: string, content: string): void {

  // Store new task into blockchain
  let accountId = Context.sender;
  if (accountId == author) {
      // Don't allow sender to yourself
      return;
  }
  let tskId = tasks.length + 1;
  let tsk = new Task(tskId, author, accountId, content, '', false);
  let index = tasks.push(tsk);
  logging.log(tsk);
}

