import RepeatingTask from "../models/repeating-task";
import packageJson from "../../package.json";
import {client} from "../discord-bot";
import {ActivitiesOptions, ActivityType} from "discord.js";
import logger from "../utils/logger";

export default class PresenceTask extends RepeatingTask {

    constructor() {
        super(30); // Delay of 30 seconds between each presence change
    }

    currentPresence = 0;

    protected async run(): Promise<void> {
        const presences = this.getPresences();
        if (presences.length === 0) {
            logger.warn("PresenceTask stopped because there are no presences");
            this.stop();
            return;
        }

        let presence = presences[this.currentPresence];
        client.user?.setPresence({
            activities: [{
                type: presence.type,
                name: presence.name
            }]
        });
        this.currentPresence = (this.currentPresence + 1) % presences.length;

        logger.debug(`Set presence to: ${ActivityType[presence.type ?? 0]} ${presence.name}`);

        if (presences.length <= 1) {
            this.stop();
            logger.debug("PresenceTask will not repeat because there is only one presence");
        }
    }

    getPresences(): ActivitiesOptions[] {
        let totalUsers = 0;
        client.guilds.cache.forEach(guild => totalUsers += guild.memberCount);

        return [
            {
                type: ActivityType.Watching,
                name: packageJson.version,
            },
            {
                type: ActivityType.Watching,
                name: totalUsers + " users in " + client.guilds.cache.size + " guilds"
            }
        ]
    }

}
