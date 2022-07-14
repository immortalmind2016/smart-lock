import { cleanEnv, port, str } from "envalid";
import "dotenv/config";

const envConfig = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  DB_PORT: port({ default: 5432 }),
  DB_HOST: str({ default: "localhost" }),
  DB_USER: str({ default: "test" }),
  DB_PASSWORD: str({ default: "test" }),
  DB_NAME: str({ default: "test" }),
});

export default envConfig;
