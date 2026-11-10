import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StudentReportRow {
  @Field() studentCode!: string;
  @Field() fullName!: string;
  @Field() gender!: string;
  @Field(() => Int) age!: number;
  @Field(() => String, { nullable: true }) roomNumber!: string | null;
  @Field(() => String, { nullable: true }) roomName!: string | null;
  @Field(() => Int, { nullable: true }) academicYear!: number | null;
}

@ObjectType()
export class StudentReport {
  @Field({ description: "วันที่ใช้คำนวณอายุจาก MySQL (YYYY-MM-DD)" })
  asOfDate!: string;
  @Field(() => [StudentReportRow]) rows!: StudentReportRow[];
}
