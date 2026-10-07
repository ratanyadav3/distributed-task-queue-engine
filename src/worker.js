import dotenv from "dotenv";

import { connectRedis } from "./config/redis.js";
import { getTask,updateTask } from "./queue/taskQueue.js";
import { executeTask } from "./tasks/taskHandler.js";

dotenv.config();

async function startWorker() {
    await connectRedis();

    console.log("Worker started");
    console.log("Waiting for tasks...");

    while (true) {

    const task = await getTask();

    console.log("Received task:", task.id);

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
            "Task completed:",
            task.id
        );

    } catch (error) {

        await updateTask(task.id, {
            status: "failed",
            completedAt: new Date().toISOString(),
            error: error.message
        });

        console.error(
            "Task failed:",
            task.id
        );
    }
}
}

startWorker();