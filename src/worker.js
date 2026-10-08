import dotenv from "dotenv";

import { connectRedis } from "./config/redis.js";
import { getTask,updateTask } from "./queue/taskQueue.js";
import { executeTask } from "./tasks/taskHandler.js";

dotenv.config();

const WORKER_ID = process.env.WORKER_ID || "worker-1";

async function startWorker() {
    await connectRedis();

    console.log(`${WORKER_ID} started`);
    console.log(`${WORKER_ID} waiting for tasks...`);

    while (true) {

    const task = await getTask();

    console.log(
    `${WORKER_ID} received task:`,
    task.id
);

    await updateTask(task.id, {
        status: "processing",
        startedAt: new Date().toISOString()
    });

    try {

        await executeTask(task);

        await updateTask(task.id, {
            status: "completed",
            completedAt: new Date().toISOString()
        });

        console.log(
        `${WORKER_ID} completed task:`,
        task.id);

    } catch (error) {

        await updateTask(task.id, {
            status: "failed",
            completedAt: new Date().toISOString(),
            error: error.message
        });

        console.error(
            `${WORKER_ID} task failed:`,
            task.id
        );
    }
}
}

startWorker();