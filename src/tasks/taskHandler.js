async function sendEmail(payload) {
    console.log("Sending email...");
    console.log("To:", payload.to);
    console.log("Subject:", payload.subject);

    await new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    console.log("Email sent successfully");
}

async function benchmarkTask(payload) {
    await new Promise((resolve) => {
        setTimeout(resolve, payload.duration);
    });
}


async function generateReport(payload) {
    console.log("Generating report...");
    console.log("Report name:", payload.name);

    await new Promise((resolve) => {
        setTimeout(resolve, 4000);
    });

    console.log("Report generated successfully");
}


async function resizeImage(payload) {
    console.log("Resizing image...");
    console.log("Input:", payload.input);
    console.log("Output:", payload.output);
    console.log("Width:", payload.width);
    console.log("Height:", payload.height);

    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    console.log("Image resized successfully");
}


async function generatePDF(payload) {
    console.log("Generating PDF...");
    console.log("File name:", payload.fileName);

    await new Promise((resolve) => {
        setTimeout(resolve, 5000);
    });

    console.log("PDF generated successfully");
}


async function executeTask(task) {

    console.log("--------------------------------");
    console.log("Executing task");
    console.log("Task ID:", task.id);
    console.log("Task Type:", task.type);
    console.log("Payload:", task.payload);
    console.log("--------------------------------");

    switch (task.type) {

        case "send-email":
            await sendEmail(task.payload);
            break;

        case "generate-report":
            await generateReport(task.payload);
            break;

        case "resize-image":
            await resizeImage(task.payload);
            break;

        case "generate-pdf":
            await generatePDF(task.payload);
            break;
        
        case "benchmark-task":
            await benchmarkTask(task.payload);
            break;


        default:
            throw new Error(`Unknown task type: ${task.type}`);
    }

    console.log("Task completed:", task.id);
}


export {
    executeTask
};