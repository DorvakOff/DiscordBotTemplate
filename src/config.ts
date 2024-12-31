import dotenv from 'dotenv';

dotenv.config();

const required = (name: string): string => {
    if (!process.env[name]) {
        throw new Error(`Missing required environment variable ${name}`);
    }
    return process.env[name];
}

const boolean = (name: string): boolean => {
    const value = process.env[name] ?? '';
    const trueValues = ['true', '1'];
    return trueValues.includes(value.toLowerCase());
}

const optional = (name: string, defaultValue: string): string => {
    return process.env[name] ?? defaultValue;
}

const config = {
    token: required('TOKEN'),
    environment: optional('NODE_ENV', 'development'),
    debug: boolean('DEBUG'),
}

export default config;
