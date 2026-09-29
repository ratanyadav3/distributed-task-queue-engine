import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";

import { connectRedis } from "./config/redis.js";
import { addTask } from "./queue/taskQueue.js";

dotenv.config();

const app = express();

app.use(express.json());

await connectRedis();

app.post("/tasks", async (req, res) => {

    const task = {
        id: crypto.randomUUID(),

        type: req.body.type,

        payload: req.body.payload,

        createdAt: new Date().toISOString()
    };

    await addTask(task);

    res.status(202).json({
        message: "Task added to queue",
        taskId: task.id
    });
});

app.get("/", (req, res) => {
    res.json({
        message: "Task Queue API is running"
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});