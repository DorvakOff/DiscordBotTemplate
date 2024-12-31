import {startDiscordBot} from "./discord-bot";
import commandService from "./services/command-service";
import InfoCommand from "./commands/info-command";
import taskService from "./services/task-service";
import PresenceTask from "./tasks/presence-task";

const onStart = async () => {
    // Add all commands
    commandService.addCommand(InfoCommand);

    // Add all tasks
    taskService.tasks.set('PresenceTask', PresenceTask);

    // Starting presence update
    taskService.start('PresenceTask');
}

startDiscordBot(onStart);
