import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DashboardSummary {
  @Field(() => Int) academicYear!: number;
  @Field(() => [Int]) academicYears!: number[];
  @Field(() => Int, { description: "นักเรียนที่ยังใช้งานอยู่ทั้งหมดในปัจจุบัน" }) totalStudents!: number;
  @Field(() => Int, { description: "ห้องเรียนที่ยังใช้งานอยู่ในปีที่เลือก" }) totalClassrooms!: number;
  @Field(() => Int) assignedStudents!: number;
  @Field(() => Int) unassignedStudents!: number;
}
