import "reflect-metadata";
import { DataSource } from "typeorm";
require("dotenv").config();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: process.env.DB_NAME,
	password: process.env.DB_USER_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: ["src/entities/**/*.ts"],
	migrations: [],
	subscribers: [],
});
