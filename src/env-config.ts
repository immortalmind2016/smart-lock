import { cleanEnv, port } from "envalid";

const envConfig = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
});

export default envConfig;
