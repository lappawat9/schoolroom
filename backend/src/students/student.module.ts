import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookupModule } from "../common/lookup.module.js";
import { Student } from "./student.entity.js";
import { StudentResolver } from "./student.resolver.js";
import { StudentService } from "./student.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([Student]), LookupModule],
  providers: [StudentService, StudentResolver],
  exports: [StudentService],
})
export class StudentModule {}
