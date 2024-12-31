import logger from "../utils/logger";
import Task from "../models/task";

const tasks: Map<string, any> = new Map();

function start(taskName: string) {
    let task = tasks.get(taskName);
    if (!task) {
        logger.error(`Task ${taskName} not found`);
        return;
    }

    let t: Task = new task();
    t.start();
}

const taskService = {
    start,
    tasks
}

export default taskService;
