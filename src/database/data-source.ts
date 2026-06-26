import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Property } from '../properties/entities/property.entity';
import { InitPropertySchema1719326400000 } from './migrations/1719326400000-InitPropertySchema';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: false,
  logging: false,

  entities: [Property],
  migrations: [InitPropertySchema1719326400000],
});
