import { InjectionToken } from '@angular/core';
import { AppConfig } from './app.config.model';

export const DEFAULT_APP_CONFIG: AppConfig = {
  apiBaseUrl: 'http://localhost:3000/api',
  auth: {
    enabled: true,
    tokenKey: 'task_board_token',
    refreshTokenKey: 'task_board_refresh_token',
    loginEndpoint: '/auth/login',
    refreshEndpoint: '/auth/refresh',
  },
  board: {
    defaultColumns: [
      { id: 'backlog', name: 'Backlog', icon: 'inbox', color: '#6b7280', order: 0 },
      { id: 'in-progress', name: 'In Progress', icon: 'autorenew', color: '#f59e0b', order: 1 },
      { id: 'validation', name: 'Validation', icon: 'verified', color: '#8b5cf6', order: 2 },
      { id: 'done', name: 'Done', icon: 'check_circle', color: '#10b981', order: 3 },
    ],
    allowColumnManagement: true,
    maxTasksPerColumn: 50,
  },
  features: {
    burndownChart: true,
    comments: true,
    commits: true,
    teamAvatars: true,
  },
  theme: {
    default: 'dark',
  },
};

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_APP_CONFIG,
});
