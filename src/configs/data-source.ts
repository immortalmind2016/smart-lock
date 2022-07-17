import "reflect-metadata";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import envConfig from "./env-config";

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, isTest } = envConfig;
console.log({ isTest });
const options = {
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: isTest ? true : false,
  logging: false,
  entities: [`${__dirname}/../**/**/entities/*.entity.ts`],
  seeds: [`${__dirname}/../seeds/*.ts`],
  migrations: [`${__dirname}/../migrations/*.ts`],
};

export const AppDataSource = new DataSource(
  options as PostgresConnectionOptions
);
export default options;
