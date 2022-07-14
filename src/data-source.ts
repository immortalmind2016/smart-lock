import "reflect-metadata";
import { DataSource } from "typeorm";
import envConfig from "./utils/env-config";

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = envConfig;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [`${__dirname}/entities/*.ts`],
});
