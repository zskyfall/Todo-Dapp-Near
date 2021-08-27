import { getTasksByAccountId, getAllTasks, addNewTask, toggleTaskDone } from '..'
import { Task, tasks } from '../model'
import { storage, Context, logging } from 'near-sdk-as'

describe('addNewTask ', () => {
  it('should be set and read', () => {
       // Store new task into blockchain
      let tskId = 1;
      let accountId = Context.sender;
      let author = 'nguyenhuuthang.dev';
      let content = 'content.test';
      let now = Date.now().toString();
      let tsk = new Task(tskId, author, accountId, content, now, false);
      let index = tasks.push(tsk);
      logging.log(tsk);
  })
})

