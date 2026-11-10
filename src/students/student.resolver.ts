import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StudentService } from "./student.service.js";
import {
  CreateStudentInput,
  StudentFilterInput,
  UpdateStudentInput,
} from "./student.input.js";
import { StudentClassroomHistory, StudentModel, StudentPage } from "./student.model.js";

@Resolver(() => StudentModel)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => StudentPage, { description: "ค้นหานักเรียนและแบ่งหน้า" })
  students(
    @Args("filter", { type: () => StudentFilterInput, nullable: true })
    filter?: StudentFilterInput,
  ) {
    return this.studentService.findAll(filter ?? new StudentFilterInput());
  }

  @Query(() => StudentModel)
  student(@Args("id", { type: () => Int }) id: number) {
    return this.studentService.findOne(id);
  }

  @Query(() => [StudentClassroomHistory], {
    description: "ประวัติจัดห้อง รวมรายการที่สิ้นสุดแล้วและห้องที่ถูกลบ",
  })
  studentClassroomHistory(@Args("studentId", { type: () => Int }) studentId: number) {
    return this.studentService.classroomHistory(studentId);
  }

  @Mutation(() => StudentModel)
  createStudent(@Args("input") input: CreateStudentInput) {
    return this.studentService.create(input);
  }

  @Mutation(() => StudentModel)
  updateStudent(
    @Args("id", { type: () => Int }) id: number,
    @Args("input") input: UpdateStudentInput,
  ) {
    return this.studentService.update(id, input);
  }

  @Mutation(() => Boolean, { description: "Soft delete นักเรียนและรายการจัดห้อง" })
  async deleteStudent(@Args("id", { type: () => Int }) id: number) {
    await this.studentService.remove(id);
    return true;
  }
}
