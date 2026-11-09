import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { PaginationInput, Trim } from "../common/pagination.input.js";

@InputType()
export class CreateStudentInput {
  @Field({ description: "เลขประจำตัว สองหลักแรกเป็นปีที่เข้าเรียน เช่น 69001" })
  @Trim()
  @IsString()
  @Matches(/^\d{2}\S*$/, {
    message: "เลขประจำตัวต้องขึ้นต้นด้วยปีที่เข้าเรียน 2 หลัก",
  })
  @MaxLength(20)
  studentCode!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  prefixId!: number;

  @Field()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @Field()
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  genderId!: number;

  @Field({ description: "วันเกิด ค.ศ. YYYY-MM-DD ต้องไม่อยู่ในอนาคต" })
  @IsDateString({ strict: true })
  birthDate!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  gradeLevelId!: number;
}

@InputType()
export class UpdateStudentInput extends PartialType(CreateStudentInput, {
  skipNullProperties: false,
}) {}

@InputType()
export class StudentFilterInput extends PaginationInput {
  @Field({ nullable: true })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(20)
  studentCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(200)
  name?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  gradeLevelId?: number;
}
