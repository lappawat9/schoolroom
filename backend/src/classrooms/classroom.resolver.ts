import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StudentFilterInput } from "../students/student.input";
import { StudentModel, StudentPage } from "../students/student.model";
import { ClassroomService } from "./classroom.service";
import {
  ClassroomFilterInput,
  CreateClassroomInput,
  UpdateClassroomInput,
} from "./classroom.input";
import { ClassroomModel, ClassroomPage } from "./classroom.model";

@Resolver(() => ClassroomModel)
export class ClassroomResolver {
  constructor(private readonly classroomService: ClassroomService) {}

  @Query(() => ClassroomPage)
  classrooms(
    @Args("filter", { type: () => ClassroomFilterInput, nullable: true })
    filter?: ClassroomFilterInput,
  ) {
    return this.classroomService.findAll(filter ?? new ClassroomFilterInput());
  }

  @Query(() => ClassroomModel)
  classroom(@Args("id", { type: () => Int }) id: number) {
    return this.classroomService.findOne(id);
  }

  @Query(() => StudentPage)
  classroomStudents(
    @Args("classroomId", { type: () => Int }) classroomId: number,
    @Args("filter", { type: () => StudentFilterInput, nullable: true })
    filter?: StudentFilterInput,
  ) {
    return this.classroomService.findStudents(
      classroomId,
      filter ?? new StudentFilterInput(),
    );
  }

  @Mutation(() => ClassroomModel)
  createClassroom(@Args("input") input: CreateClassroomInput) {
    return this.classroomService.create(input);
  }

  @Mutation(() => ClassroomModel)
  updateClassroom(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: UpdateClassroomInput,
  ) {
    return this.classroomService.update(id, input);
  }

  @Mutation(() => Boolean, { description: "Soft delete ห้อง เก็บข้อมูลนักเรียนไว้" })
  async deleteClassroom(@Args("id", { type: () => Int }) id: number) {
    await this.classroomService.remove(id);
    return true;
  }

  @Mutation(() => StudentModel, {
    description: "เพิ่มหรือย้ายเข้าห้อง โดยเก็บประวัติห้องเดิมของปีเดียวกัน",
  })
  assignStudent(
    @Args("classroomId", { type: () => Int }) classroomId: number,
    @Args("studentId", { type: () => Int }) studentId: number,
  ) {
    return this.classroomService.addStudent(classroomId, studentId);
  }

  @Mutation(() => StudentModel)
  removeStudentFromClassroom(
    @Args("classroomId", { type: () => Int }) classroomId: number,
    @Args("studentId", { type: () => Int }) studentId: number,
  ) {
    return this.classroomService.removeStudent(classroomId, studentId);
  }
}
