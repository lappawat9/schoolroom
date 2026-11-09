import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookupModule } from "../common/lookup.module";
import { Student } from "./student.entity";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

@Module({
  imports: [TypeOrmModule.forFeature([Student]), LookupModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
