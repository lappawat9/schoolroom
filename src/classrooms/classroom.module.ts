import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookupModule } from "../common/lookup.module.js";
import { StudentModule } from "../students/student.module.js";
import { Classroom } from "./classroom.entity.js";
import { ClassroomResolver } from "./classroom.resolver.js";
import { ClassroomService } from "./classroom.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([Classroom]), StudentModule, LookupModule],
  providers: [ClassroomService, ClassroomResolver],
})
export class ClassroomModule {}
