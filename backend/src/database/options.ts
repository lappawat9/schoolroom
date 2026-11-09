import "dotenv/config";
import { DataSourceOptions } from "typeorm";
import { Classroom } from "../classrooms/classroom.entity.js";
import { Student } from "../students/student.entity.js";
import { ClassroomStudent } from "../classrooms/classroom-student.entity.js";
import { Gender, GradeLevel, Prefix, Teacher } from "../common/lookup.entity.js";

export function databaseOptions(): DataSourceOptions {
  for (const key of ["DB_HOST", "DB_USERNAME", "DB_PASSWORD", "DB_DATABASE"]) {
    if (!process.env[key])
      throw new Error(`Missing environment variable: ${key}`);
  }
  return {
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: "utf8mb4",
    timezone: "Z",
    entities: [
      Student,
      Classroom,
      ClassroomStudent,
      Prefix,
      Gender,
      GradeLevel,
      Teacher,
    ],
    synchronize: false,
    logging: false,
    poolSize: Number(process.env.DB_POOL_SIZE || 3),
    connectTimeout: 10000,
    ...(process.env.DB_SSL === "true"
      ? { ssl: { rejectUnauthorized: true } }
      : {}),
  };
}
