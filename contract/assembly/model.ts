import { env, PersistentVector, PersistentMap } from "near-sdk-as";

/**
 * A data structure that stores the information of a message
 */
@nearBindgen
export class Task {
    id: i32;                // Must be greater than 0
    author: string;
    accountId: String;
    content: string;
    timestamp: u64;
    isDone: boolean;

    constructor(_id: i32, _author: string, _accountId: String, _content: string, _timestamp: string, _isDone: boolean) {
        this.id = _id;
        this.author = _author;
        this.accountId = _accountId;
        this.content = _content;
        this.timestamp = env.block_timestamp();
        this.isDone = _isDone;
    }
}

// An array that stores tasks on the blockchain
export const tasks = new PersistentVector<Task>("tks");
