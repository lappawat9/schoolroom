import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookupModule } from "../common/lookup.module";
import { StudentModule } from "../students/student.module";
import { Classroom } from "./classroom.entity";
import { ClassroomResolver } from "./classroom.resolver";
import { ClassroomService } from "./classroom.service";

@Module({
  imports: [TypeOrmModule.forFeature([Classroom]), StudentModule, LookupModule],
  providers: [ClassroomService, ClassroomResolver],
})
export class ClassroomModule {}
