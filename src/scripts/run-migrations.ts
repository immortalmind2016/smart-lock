import envConfig from "../../src/configs/env-config";
import { AppDataSource } from "../configs/data-source";

(async () => {
  await AppDataSource.initialize();
  console.log(envConfig);
  console.log("run migrations");
  await AppDataSource.runMigrations();
  console.log("migrations have been done");
  await AppDataSource.destroy();
})();
