import dateUtils from "./date";
import config from "../config";

const colors = {
    reset: (text: string = '') => `\x1b[0m${text}`,
    cyan: (text: string = '') => `\x1b[36m${text}`,
    blue: (text: string = '') => `\x1b[34m${text}`,
    red: (text: string = '') => `\x1b[31m${text}`,
    green: (text: string = '') => `\x1b[32m${text}`,
    white: (text: string = '') => `\x1b[37m${text}`,
    yellow: (text: string = '') => `\x1b[33m${text}`,
    gray: (text: string = '') => `\x1b[90m${text}`
}

enum LogLevel {
    INFO = 'INFO',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    WARN = 'WARN',
    DEBUG = 'DEBUG'
}

// Get the length of the longest level name to align the messages
const biggerLevelName = Math.max(...Object.values(LogLevel).map((level) => level.length));

// Format : [YYYY-MM-DD HH:mm:ss] - LEVEL : MESSAGE
const formatMessage = (level: LogLevel, message: string) => {
    let msg = colors.cyan(`[${dateUtils.formatDate('YYYY-MM-DD HH:mm:ss')}]`);
    msg += colors.white(' - ');

    let msgColor;

    switch (level) {
        case LogLevel.INFO:
            msg += colors.blue('INFO');
            msgColor = colors.reset;
            break;
        case LogLevel.ERROR:
            msg += colors.red('ERROR');
            msgColor = colors.red;
            break;
        case LogLevel.WARN:
            msg += colors.yellow('WARN');
            msgColor = colors.yellow;
            break;
        case LogLevel.SUCCESS:
            msg += colors.green('SUCCESS');
            msgColor = colors.green;
            break;
        case LogLevel.DEBUG:
            msg += colors.yellow('DEBUG');
            msgColor = colors.gray;
            break;
    }

    // Add spaces to have a fixed length of 7 for the type (aligns the message)
    msg += ' '.repeat(biggerLevelName - level.length);
    msg += colors.white(' : ');
    msg += msgColor(message);
    msg += colors.reset();
    return msg;
}

const info = (message: string) => {
    console.log(formatMessage(LogLevel.INFO, message));
}

const error = (message: string, error?: any) => {
    console.log(formatMessage(LogLevel.ERROR, `${message} ${error ? error : ''}`));
}

const warn = (message: string) => {
    console.log(formatMessage(LogLevel.WARN, message));
}

const success = (message: string) => {
    console.log(formatMessage(LogLevel.SUCCESS, message));
}

const debug = (message: string) => {
    if (config.debug) {
        console.log(formatMessage(LogLevel.DEBUG, message));
    }
}

const logger = {
    info,
    error,
    warn,
    success,
    debug,
    colors
}

export default logger;
