import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgresql://main_owner:K4zEaVnj6Yhq@ep-small-mud-a5u04kjx-pooler.us-east-2.aws.neon.tech/main?sslmode=require",
  entities: [__dirname + "/entities/*.{ts,js}"],

  synchronize: true, // disable in production
  logging: false,
});
