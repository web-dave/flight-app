import { Injectable, InjectionToken } from '@angular/core';
import { LogLevel } from './log-level';

export abstract class LogAppender {
  abstract append(level: LogLevel, category: string, msg: string): void;
}

@Injectable()
export class DefaultLogAppender implements LogAppender {
  logs: string[] = [];
  append(level: LogLevel, category: string, msg: string): void {
    console.log('DefaultLogAppender', msg);
    this.logs.push(msg);
  }
}

@Injectable()
export class CustomLogAppender implements LogAppender {
  logs: string[] = [];

  append(level: LogLevel, category: string, msg: string): void {
    console.log('CustomLogAppender', msg);
    this.logs.push(msg);
  }
}

export const LOG_APPENDERS = new InjectionToken<LogAppender[]>('LOG_APPENDERS');
