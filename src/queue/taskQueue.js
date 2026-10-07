import { redis } from "../config/redis.js";

const QUEUE_NAME = "task:queue";

function getTaskKey(taskId) {
    return `task:${taskId}`;
}


async function addTask(task) {

    await redis.set(
        getTaskKey(task.id),
        JSON.stringify(task)
    );

    await redis.rPush(
        QUEUE_NAME,
        JSON.stringify(task)
    );

    console.log("Task added to queue:", task.id);
}


async function getTask() {

    const result = await redis.blPop(
        QUEUE_NAME,
        0
    );

    return JSON.parse(result.element);
}


async function updateTask(taskId, updates) {

    const key = getTaskKey(taskId);

    const existingTask = await redis.get(key);

    if (!existingTask) {
        throw new Error(
            `Task not found: ${taskId}`
        );
    }

    const task = JSON.parse(existingTask);

    const updatedTask = {
        ...task,
        ...updates
    };

    await redis.set(
        key,
        JSON.stringify(updatedTask)
    );

    return updatedTask;
}


async function getTaskStatus(taskId) {

    const task = await redis.get(
        getTaskKey(taskId)
    );

    if (!task) {
        return null;
    }

    return JSON.parse(task);
}


export {
    addTask,
    getTask,
    updateTask,
    getTaskStatus
};