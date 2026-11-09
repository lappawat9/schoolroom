import { Module } from "@nestjs/common";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule, Query, Resolver } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { databaseOptions } from "./database/options";
import { StudentModule } from "./students/student.module";
import { ClassroomModule } from "./classrooms/classroom.module";
import { formatGraphQLError } from "./common/graphql-error";
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
  ],
  providers: [HealthResolver],
})
export class AppModule {}
