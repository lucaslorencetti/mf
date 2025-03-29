export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const logConfig = {
  minLevel:
    process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  silent: process.env.NODE_ENV === 'test',
};

const log = (level: LogLevel, message: string, context?: unknown): void => {
  if (shouldSkipLog(level) || logConfig.silent) {
    return;
  }

  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(formattedMessage, context || '');
      break;
    case LogLevel.INFO:
      console.info(formattedMessage, context || '');
      break;
    case LogLevel.WARN:
      console.warn(formattedMessage, context || '');
      break;
    case LogLevel.ERROR:
      console.error(formattedMessage, context || '');
      break;
  }
};

const shouldSkipLog = (level: LogLevel): boolean => {
  const levels = Object.values(LogLevel);
  const minLevelIndex = levels.indexOf(logConfig.minLevel);
  const currentLevelIndex = levels.indexOf(level);

  return currentLevelIndex < minLevelIndex;
};

export const logDebug = (message: string, context?: unknown): void => {
  log(LogLevel.DEBUG, message, context);
};

export const logInfo = (message: string, context?: unknown): void => {
  log(LogLevel.INFO, message, context);
};

export const logWarn = (message: string, context?: unknown): void => {
  log(LogLevel.WARN, message, context);
};

export const logError = (message: string, context?: unknown): void => {
  log(LogLevel.ERROR, message, context);
};
