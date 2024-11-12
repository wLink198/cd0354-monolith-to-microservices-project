import { Sequelize } from 'sequelize-typescript';
import { config } from './config/config';


export const sequelize = new Sequelize({
  'username': config.username,
  'password': config.password,
  'database': config.database,
  'host': config.host,
  'dialect': config.dialect,
  'dialectOptions': {
    'ssl': {
      'require': true,             // Enforces SSL connection
      'rejectUnauthorized': false, // Accepts self-signed certificates (useful for RDS)
    },
  },
  'storage': ':memory:',
});
