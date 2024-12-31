import {APIEmbed as discordEmbed} from "discord-api-types/v10";
import pkg from "../../package.json";
import i18nService, {Locale} from "../services/i18n";

type APIEmbed = discordEmbed;

const createEmbed = (embed: APIEmbed, lng: Locale = i18nService.defaultLocale): APIEmbed => {
    return {
        color: 0x0984e3,
        timestamp: new Date().toISOString(),
        footer: {
            text: i18nService.t('embed.footer', {version: pkg.version, author: pkg.author, lng})
        },
        ...embed
    }
}

export {APIEmbed, createEmbed};
