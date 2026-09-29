async function executeTask(task) {
    console.log("--------------------------------");
    console.log("Executing task");
    console.log("Task ID:", task.id);
    console.log("Task Type:", task.type);
    console.log("Payload:", task.payload);
    console.log("--------------------------------");

    // Simulate some background work
    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    console.log("Task completed:", task.id);
}

export {
    executeTask
};