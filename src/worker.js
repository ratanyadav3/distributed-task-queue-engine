import dotenv from "dotenv";

import { connectRedis } from "./config/redis.js";
import { getTask } from "./queue/taskQueue.js";
import { executeTask } from "./tasks/taskHandler.js";

dotenv.config();

async function startWorker() {
    await connectRedis();

    console.log("Worker started");
    console.log("Waiting for tasks...");

    while (true) {
        const task = await getTask();

        console.log("Received task:", task.id);

        await executeTask(task);
    }
}

startWorker();