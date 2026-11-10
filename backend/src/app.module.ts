import { Controller, Get, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { databaseOptions } from "./database/options";
import { StudentModule } from "./students/student.module";
import { ClassroomModule } from "./classrooms/classroom.module";
import { ReportModule } from "./reports/report.module";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
@ApiTags("Health")
@Controller("health")
class HealthController {
  constructor(private readonly dataSource: DataSource) {}
  @Get()
  @ApiOperation({ summary: "ตรวจสอบ API และการเชื่อมต่อ MySQL" })
  async health() {
    await this.dataSource.query("SELECT 1");
    return { status: "ok" };
  }
}
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseOptions()),
    StudentModule,
    ClassroomModule,
    ReportModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
