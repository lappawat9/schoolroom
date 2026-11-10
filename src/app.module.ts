import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule, Query, Resolver } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { databaseOptions } from "./database/options.js";
import { StudentModule } from "./students/student.module.js";
import { ClassroomModule } from "./classrooms/classroom.module.js";
import { formatGraphQLError } from "./common/graphql-error.js";
import { ReportModule } from "./reports/report.module.js";
@Resolver()
class HealthResolver {
  constructor(private readonly dataSource: DataSource) {}
  @Query(() => String, { description: "ตรวจสอบ API และการเชื่อมต่อ MySQL" })
  async health() {
    await this.dataSource.query("SELECT 1");
    return "ok";
  }
}
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseOptions()),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: "/api/graphql",
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      introspection: true,
      includeStacktraceInErrorResponses: false,
      autoTransformHttpErrors: false,
      formatError: formatGraphQLError,
    }),
    StudentModule,
    ClassroomModule,
    ReportModule,
  ],
  providers: [HealthResolver],
})
export class AppModule {}
