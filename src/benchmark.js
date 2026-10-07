const TOTAL_TASKS = 100;
const TASK_DURATION = 100;

async function sendTask() {

    const response = await fetch(
        "http://localhost:3000/tasks",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "benchmark-task",
                payload: {
                    duration: TASK_DURATION
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            `Request failed: ${response.status}`
        );
    }

    return response.json();
}


async function getTaskStatus(taskId) {

    const response = await fetch(
        `http://localhost:3000/tasks/${taskId}`
    );

    if (!response.ok) {
        throw new Error(
            `Status request failed: ${response.status}`
        );
    }

    return response.json();
}


function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


async function waitForTask(taskId) {

    while (true) {

        const task = await getTaskStatus(taskId);

        if (
            task.status === "completed" ||
            task.status === "failed"
        ) {
            return task;
        }

        await sleep(100);
    }
}


async function runBenchmark() {

    console.log("========================================");
    console.log("        TASK QUEUE BENCHMARK");
    console.log("========================================");

    console.log("Workers         : 1");
    console.log("Tasks           :", TOTAL_TASKS);
    console.log("Task duration   :", TASK_DURATION, "ms");

    console.log("----------------------------------------");

    const startTime = Date.now();

    const promises = [];

    for (let i = 0; i < TOTAL_TASKS; i++) {

        promises.push(
            sendTask()
        );
    }

    const tasks = await Promise.all(promises);

    const submissionTime = Date.now() - startTime;

    console.log(
        "All tasks submitted in:",
        submissionTime,
        "ms"
    );

    console.log("Waiting for worker...");

    const completedTasks = [];

    for (const task of tasks) {

        const result = await waitForTask(
            task.taskId
        );

        completedTasks.push(result);
    }

    const totalTime = Date.now() - startTime;

    let successful = 0;
    let failed = 0;

    let totalQueueWait = 0;
    let maxQueueWait = 0;

    for (const task of completedTasks) {

        if (task.status === "completed") {
            successful++;
        } else {
            failed++;
        }

        const created =
            new Date(task.createdAt).getTime();

        const started =
            new Date(task.startedAt).getTime();

        const queueWait =
            started - created;

        totalQueueWait += queueWait;

        maxQueueWait =
            Math.max(maxQueueWait, queueWait);
    }

    const throughput =
        successful / (totalTime / 1000);

    const averageQueueWait =
        totalQueueWait / completedTasks.length;

    console.log("----------------------------------------");

    console.log(
        "Submission time    :",
        submissionTime,
        "ms"
    );

    console.log(
        "Total time         :",
        totalTime,
        "ms"
    );

    console.log(
        "Throughput         :",
        throughput.toFixed(2),
        "jobs/sec"
    );

    console.log(
        "Successful         :",
        successful
    );

    console.log(
        "Failed             :",
        failed
    );

    console.log(
        "Average queue wait :",
        averageQueueWait.toFixed(2),
        "ms"
    );

    console.log(
        "Max queue wait     :",
        maxQueueWait,
        "ms"
    );

    console.log("========================================");
}


runBenchmark();