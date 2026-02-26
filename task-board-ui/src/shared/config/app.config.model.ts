export interface ColumnConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
}

export interface AppConfig {
  apiBaseUrl: string;
  auth: {
    enabled: boolean;
    tokenKey: string;
    refreshTokenKey: string;
    loginEndpoint: string;
    refreshEndpoint: string;
  };
  board: {
    defaultColumns: ColumnConfig[];
    allowColumnManagement: boolean;
    maxTasksPerColumn?: number;
  };
  features: {
    burndownChart: boolean;
    comments: boolean;
    commits: boolean;
    teamAvatars: boolean;
  };
  theme: {
    default: 'light' | 'dark';
  };
}
