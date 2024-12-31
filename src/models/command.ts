import {
    CommandInteraction,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import i18nService, {Locale, Localizations} from "../services/i18n";
import {APIEmbed} from "./api-embed";
import {createEmbed} from "./api-embed";
import i18n from "i18next";

export default abstract class Command {

    protected guildId: string | null = null;
    protected name: string;
    protected locale: Locale = 'en-US';
    protected data!: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

    protected constructor(name: string) {
        this.name = name;
    }

    setGuildId(guildId: string) {
        this.guildId = guildId;
    }

    setLocale(locale: Locale) {
        this.locale = locale;
    }

    getLocale(): Locale {
        return this.locale;
    }

    getName(): string {
        return this.name;
    }

    getData(): SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder {
        return this.data;
    }

    t(key: string, options?: any): any {
        let prefix = 'commands:' + this.name + '.';
        return i18nService.t(prefix + key, { lng: this.locale, ...options });
    }

    getLocalizations(key: string): Localizations {
        let path = `commands:${this.getName()}.${key}`;
        let localizations: Localizations = {};
        i18nService.locales.forEach(locale => {
            localizations[locale] = i18n.t(path, {lng: locale});
        });

        return localizations;
    }

    createEmbed(embed: APIEmbed): APIEmbed {
        return createEmbed(embed, this.locale);
    }

    abstract execute(interaction: CommandInteraction): Promise<void>;
}
