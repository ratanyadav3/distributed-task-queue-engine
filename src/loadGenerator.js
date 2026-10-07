const TASK_TYPES = [
    "send-email",
    "generate-report",
    "resize-image",
    "generate-pdf"
];

function generateTask() {

    const type =
        TASK_TYPES[
            Math.floor(Math.random() * TASK_TYPES.length)
        ];

    switch (type) {

        case "send-email":
            return {
                type: "send-email",
                payload: {
                    to: `user${Math.floor(Math.random() * 1000)}@example.com`,
                    subject: "Test email"
                }
            };

        case "generate-report":
            return {
                type: "generate-report",
                payload: {
                    name: `report-${Date.now()}`
                }
            };

        case "resize-image":
            return {
                type: "resize-image",
                payload: {
                    input: "photo.jpg",
                    output: `resized-${Date.now()}.jpg`,
                    width: 800,
                    height: 600
                }
            };

        case "generate-pdf":
            return {
                type: "generate-pdf",
                payload: {
                    fileName: `document-${Date.now()}.pdf`
                }
            };
    }
}


async function sendTask() {

    const task = generateTask();

    const response = await fetch(
        "http://localhost:3000/tasks",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(task)
        }
    );

    return response.json();
}


async function startLoadTest() {

    const TOTAL_TASKS = 100;

    const promises = [];

    for (let i = 0; i < TOTAL_TASKS; i++) {

        promises.push(
            sendTask()
        );
    }

    const results = await Promise.all(promises);

    console.log(
        `${results.length} tasks submitted`
    );
}


startLoadTest();