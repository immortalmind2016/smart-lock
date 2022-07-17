import { bool, cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env",
});

const envConfig = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  DB_PORT: port({ default: 5432 }),
  DB_HOST: str({ default: "localhost" }),
  DB_USER: str({ default: "test" }),
  DB_PASSWORD: str({ default: "test" }),
  DB_NAME: str({ default: "test" }),
  TUYA_HOST: str({ default: "" }),
  TUYA_SECRET_KEY: str({ default: "" }),
  TUYA_ACCESS_KEY: str({ default: "" }),
  CLI: bool({ default: false }),
});

export default envConfig;
