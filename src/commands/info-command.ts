import Command from "../models/command";
import {
    ButtonBuilder,
    codeBlock,
    CommandInteraction,
    SlashCommandBuilder,
    ButtonStyle,
    ActionRowBuilder
} from "discord.js";
import {APIEmbed} from "../models/api-embed";
import {client} from "../discord-bot";
import pkg from "../../package.json";

export default class InfoCommand extends Command {

    constructor() {
        super('info');
        this.data = new SlashCommandBuilder()
            .setName(this.name)
            .setNameLocalizations(this.getLocalizations('name'))
            .setDescription(this.t('description'))
            .setDescriptionLocalizations(this.getLocalizations('description'));
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        const embed: APIEmbed = this.createEmbed({
            title: this.t('reply.title'),
            thumbnail: {
                url: client.user?.displayAvatarURL({extension: 'png'}) || '',
            },
            description: codeBlock(this.t('reply.description', {author: pkg.author})),
        });

        const addBotButton = new ButtonBuilder()
            .setLabel(this.t('reply.buttons.addBot'))
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user?.id}`);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(addBotButton);

        await interaction.reply({embeds: [embed], components: [row]});
    }

}
