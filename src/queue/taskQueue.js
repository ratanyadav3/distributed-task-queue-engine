import { redis } from "../config/redis.js";

const QUEUE_NAME = "task:queue";

async function addTask(task) {
    await redis.rPush(QUEUE_NAME, JSON.stringify(task));

    console.log("Task added:", task.id);
}

async function getTask() {
    const result = await redis.blPop(QUEUE_NAME, 0);

    return JSON.parse(result.element);
}

export {
    addTask,
    getTask
};