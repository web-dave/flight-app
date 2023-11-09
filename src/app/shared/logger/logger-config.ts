import { Type } from '@angular/core';
import { DefaultLogFormatter, LogFormatter } from './log-formatter';
import { LogLevel } from './log-level';
import { DefaultLogAppender, LogAppender } from './log-appender';

export abstract class LoggerConfig {
  abstract level: LogLevel;
  abstract formatter: Type<LogFormatter>;
  abstract appenders: Type<LogAppender>[];
}

export const defaultConfig: LoggerConfig = {
  level: LogLevel.DEBUG,
  formatter: DefaultLogFormatter,
  appenders: [DefaultLogAppender],
};
