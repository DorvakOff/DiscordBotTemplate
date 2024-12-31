import config from "./config";
import {ChatInputCommandInteraction, Client, codeBlock, Interaction, GatewayIntentBits, REST} from "discord.js";
import logger from "./utils/logger";
import commandService from "./services/command-service";
import Command from "./models/command";
import i18nService, {Locale} from "./services/i18n";
import {APIEmbed, createEmbed} from "./models/api-embed";
import taskService from "./services/task-service";
import pkg from "../package.json";

const rest = new REST().setToken(config.token);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

let onStartCallback: () => Promise<void>;

client.on('ready', async () => {
    logger.info(`Starting in ${config.environment} environment with debug mode ${config.debug ? 'enabled' : 'disabled'}`);
    await i18nService.init();
    await onStartCallback();
    logger.debug(`Commands: ${Array.from(commandService.commands.keys()).join(', ')}`);
    logger.debug(`Tasks: ${Array.from(taskService.tasks.keys()).join(', ')}`);
    commandService.deployAllCommands();
    logger.success(`Bot started with version ${pkg.version}`);
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    interaction = interaction as ChatInputCommandInteraction;

    const { commandName } = interaction;
    let command = commandService.commands.get(commandName);
    if (!command) {
        logger.error(`Command ${commandName} not found`);
        return;
    }

    const lng: Locale = 'fr';

    try {
        let c: Command = new command();
        c.setLocale(lng);
        if (interaction.guildId) c.setGuildId(interaction.guildId);
        await c.execute(interaction);
    } catch (error: any) {
        logger.error(`Error while executing command ${commandName}: ${error}`);
        let description = i18nService.t('error.description', {lng});

        if (config.debug) {
            description += `\n${codeBlock(error)}`;
        }

        const embed: APIEmbed = createEmbed({
            title: i18nService.t('error.title', {lng}),
            description,
            color: 0xff0000
        }, lng);

        if (!interaction.replied) {
            await interaction.reply({embeds: [embed], ephemeral: true});
        } else {
            await interaction.followUp({embeds: [embed], ephemeral: true});
        }
    }
});

const startDiscordBot = (callBack: () => Promise<void>) => {
    if (client.readyAt) {
        logger.warn('Calling startDiscordBot after the bot has already started, ignoring');
        return
    }

    client.login(config.token).then(() => logger.info(`Logged in as ${client.user?.tag}`));
    onStartCallback = callBack;
}

export {client, rest, startDiscordBot};
