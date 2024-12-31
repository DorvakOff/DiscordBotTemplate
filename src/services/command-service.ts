import Command from "../models/command";
import logger from "../utils/logger";
import {client, rest} from "../discord-bot";
import {SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder} from "discord.js";

const commands: Map<string, any> = new Map();
let commandsData: Array<SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder> = [];

function addCommand(command: any) {
    const instance: Command = new command();
    commands.set(instance.getName(), command);
    commandsData.push(instance.getData());
}

function deployAllCommands() {
    logger.debug(`Started refreshing application commands for all guilds (count: ${client.guilds.cache.size})...`);
    let promises: Promise<void>[] = [];

    for (const guild of client.guilds.cache.values()) {
        promises.push(deployCommands(guild.id));
    }

    Promise.all(promises).then(() => {
        logger.debug(`Successfully reloaded application commands for all guilds (count: ${client.guilds.cache.size}).`);
    }).catch(error => {
        logger.error(`Failed to refresh application commands: ${error}`);
    });
}

async function deployCommands(guildId: string) {
    try {
        logger.debug(`Started refreshing ${commandsData.length} application commands for guild ${guildId}...`);

        await rest.put(
            `/applications/${client.user?.id}/guilds/${guildId}/commands`,
            {body: commandsData},
        );

        logger.debug(`Successfully reloaded ${commandsData.length} application commands for guild ${guildId}.`);
    } catch (error) {
        logger.error(`Failed to refresh application commands: ${error}`);
    }
}

const commandService = {
    commands,
    addCommand,
    deployAllCommands,
    deployCommands
}

export default commandService;
