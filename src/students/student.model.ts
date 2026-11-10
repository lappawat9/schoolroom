import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StudentClassroom {
  @Field(() => Int) id!: number;
  @Field() roomNumber!: string;
  @Field() name!: string;
  @Field(() => Int) academicYear!: number;
}

@ObjectType("Student")
export class StudentModel {
  @Field(() => Int) id!: number;
  @Field() studentCode!: string;
  @Field(() => Int) prefixId!: number;
  @Field() prefix!: string;
  @Field() firstName!: string;
  @Field() lastName!: string;
  @Field(() => Int) genderId!: number;
  @Field() gender!: string;
  @Field() birthDate!: string;
  @Field(() => Int) gradeLevelId!: number;
  @Field() gradeLevel!: string;
  @Field(() => Int) enrollmentYear!: number;
  @Field(() => Int, { nullable: true }) classroomId!: number | null;
  @Field(() => StudentClassroom, { nullable: true, description: "ห้องในปีที่กรอง หรือห้องล่าสุดเมื่อไม่ระบุปี" })
  classroom!: StudentClassroom | null;
  @Field(() => [StudentClassroom]) classrooms!: StudentClassroom[];
}

@ObjectType()
export class StudentPage {
  @Field(() => [StudentModel]) data!: StudentModel[];
  @Field(() => Int) total!: number;
  @Field(() => Int) page!: number;
  @Field(() => Int) pageSize!: number;
}

@ObjectType()
export class StudentClassroomHistory {
  @Field(() => Int) id!: number;
  @Field(() => Int) classroomId!: number;
  @Field(() => String, { nullable: true }) roomNumber!: string | null;
  @Field(() => String, { nullable: true }) roomName!: string | null;
  @Field(() => Int) academicYear!: number;
  @Field() addedAt!: string;
  @Field(() => String, { nullable: true }) endedAt!: string | null;
  @Field() classroomDeleted!: boolean;
  @Field() isActive!: boolean;
}
