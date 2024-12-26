import { AppConfig } from './app.config.type';
import { DatabaseConfig } from 'src/database/config/database.config.type';
import { AuthConfig } from './auth.config.type';

export type AvailableConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  auth: AuthConfig;
};
