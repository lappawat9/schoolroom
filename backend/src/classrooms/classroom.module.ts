import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookupModule } from "../common/lookup.module";
import { StudentModule } from "../students/student.module";
import { Classroom } from "./classroom.entity";
import { ClassroomController } from "./classroom.controller";
import { ClassroomService } from "./classroom.service";

@Module({
  imports: [TypeOrmModule.forFeature([Classroom]), StudentModule, LookupModule],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
