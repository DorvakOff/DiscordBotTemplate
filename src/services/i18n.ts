import i18n from 'i18next';
import logger from "../utils/logger";

// Each locale file is imported here
// This is a bit of a hack, but it's the only way to get i18next to work with typescript and webpack
// This is because we compile the typescript files before running the app, so i18next can't dynamically load the locale
// files at runtime since we create a single minified js file with all the code in it.

// en-US
import enUsTranslation from '../locales/en-US/translation.json';
import enUsCommands from '../locales/en-US/commands.json';

// fr
import frTranslation from '../locales/fr/translation.json';
import frCommands from '../locales/fr/commands.json';

// List of all the locales we support
const locales = ['en-US', 'fr'] as const;
const defaultLocale: Locale = 'en-US';

// This is a map of all the locales we support and their respective translations
const resourceMap: ResourceMap = {
    'en-US': {translation: enUsTranslation, commands: enUsCommands},
    'fr': {translation: frTranslation, commands: frCommands}
}

const init = async () => {
    for (let locale of locales) {
        if (!isLocaleAvailable(locale)) {
            logger.warn(`Locale file not found for ${locale}, translations will default to ${defaultLocale}`);
        }
    }

    await i18n.init({
        fallbackLng: defaultLocale,
        resources: resourceMap,
        interpolation: {
            escapeValue: false
        }
    });
    logger.info('i18n initialized with locales: ' + locales.join(', '))
}

const isLocaleAvailable = (locale: Locale): boolean => {
    return !!resourceMap[locale];
}

type ResourceMap = { [K in Locale]: { translation: any, commands: any } };
export type Locale = typeof locales[number];
export type Localizations = { [key: string]: string };

const i18nService = {
    init,
    locales,
    defaultLocale,
    t: i18n.t.bind(i18n),
    isLocaleAvailable
}

export default i18nService;
