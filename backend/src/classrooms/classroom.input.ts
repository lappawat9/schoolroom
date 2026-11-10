import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { PaginationInput, Trim } from "../common/pagination.input.js";

@InputType()
export class CreateClassroomInput {
  @Field({ description: "เลขห้อง ต้องไม่ซ้ำในปีการศึกษาเดียวกัน" })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  roomNumber!: string;

  @Field()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @Field(() => Int, { description: "ปีการศึกษา พ.ศ." })
  @IsInt()
  @Min(2400)
  @Max(3000)
  academicYear!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  gradeLevelId!: number;

  @Field(() => Int, { nullable: true, description: "ส่ง null เพื่อนำครูออก" })
  @IsOptional()
  @IsInt()
  @Min(1)
  homeroomTeacherId?: number | null;
}

@InputType()
export class UpdateClassroomInput extends PartialType(CreateClassroomInput, {
  skipNullProperties: false,
}) {}

@InputType()
export class ClassroomFilterInput extends PaginationInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(2400)
  @Max(3000)
  academicYear?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(20)
  roomNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(150)
  teacherName?: string;
}
