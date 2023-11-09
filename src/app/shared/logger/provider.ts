import {
  EnvironmentProviders,
  Type,
  makeEnvironmentProviders,
} from '@angular/core';
import { LOG_APPENDERS, LogAppender } from './log-appender';
import { LogFormatter } from './log-formatter';
import { LoggerService } from './logger';
import { defaultConfig, LoggerConfig } from './logger-config';

export function provideLogger(
  config: Partial<LoggerConfig>
): EnvironmentProviders {
  const merged = { ...defaultConfig, ...config };
  const appenders: Type<LogAppender>[] = [
    ...defaultConfig.appenders,
    ...(config.appenders || []),
  ];
  console.log(appenders);
  return makeEnvironmentProviders([
    LoggerService,
    {
      provide: LoggerConfig,
      useValue: merged,
    },
    {
      provide: LogFormatter,
      useClass: merged.formatter,
    },
    merged.appenders.map((a) => ({
      provide: LOG_APPENDERS,
      useClass: a,
      multi: true,
    })),
    // appenders.map((a) => ({
    //   provide: LOG_APPENDERS,
    //   useClass: a,
    //   multi: true,
    // })),
  ]);
}
