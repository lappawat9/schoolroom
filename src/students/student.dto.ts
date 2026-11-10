import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsBoolean,
  Max,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { PaginationDto, Trim } from "../common/query.dto";

export class CreateStudentDto {
  @ApiProperty({
    example: "69056",
    maxLength: 20,
    pattern: "^\\d{2}\\S*$",
    description:
      "สองหลักแรกเป็นปีที่เข้าเรียน เช่น 69 หมายถึง พ.ศ. 2569 รหัสต้องไม่ซ้ำ",
  })
  @Trim()
  @IsString()
  @Matches(/^\d{2}\S*$/, {
    message: "เลขประจำตัวต้องขึ้นต้นด้วยปีที่เข้าเรียน 2 หลัก",
  })
  @MaxLength(20)
  studentCode!: string;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: "id คำนำหน้าจาก /api/lookups",
  })
  @IsInt()
  @Min(1)
  prefixId!: number;

  @ApiProperty({ example: "ต้นกล้า", minLength: 1, maxLength: 100 })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: "พัฒนกิจ", minLength: 1, maxLength: 100 })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: "id เพศจาก /api/lookups",
  })
  @IsInt()
  @Min(1)
  genderId!: number;

  @ApiProperty({
    example: "2015-05-15",
    type: String,
    format: "date",
    description: "วันเกิด ค.ศ. รูปแบบ YYYY-MM-DD ต้องไม่อยู่ในอนาคต",
  })
  @IsDateString({ strict: true })
  birthDate!: string;

  @ApiProperty({
    example: 5,
    minimum: 1,
    description: "id ระดับชั้นจาก /api/lookups",
  })
  @IsInt()
  @Min(1)
  gradeLevelId!: number;
}

export class UpdateStudentDto extends PartialType(CreateStudentDto, {
  skipNullProperties: false,
}) {}

export class StudentQueryDto extends PaginationDto {
  @ApiPropertyOptional({ type: Number, minimum: 2400, maximum: 3000, description: "ปีการศึกษา พ.ศ." })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2400)
  @Max(3000)
  academicYear?: number;

  @ApiPropertyOptional({ type: Boolean, description: "true = ยังไม่จัดห้อง, false = จัดห้องแล้ว ในปีที่เลือก" })
  @IsOptional()
  @Transform(({ value }) => value === "true" ? true : value === "false" ? false : value)
  @IsBoolean()
  unassigned?: boolean;

  @ApiPropertyOptional({
    example: "69",
    description: "ค้นหาบางส่วนของเลขประจำตัว",
    maxLength: 20,
  })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(20)
  studentCode?: string;

  @ApiPropertyOptional({
    example: "ต้นกล้า",
    description: "ค้นหาบางส่วนของชื่อหรือนามสกุล",
    maxLength: 200,
  })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({
    type: Number,
    example: 5,
    minimum: 1,
    description: "id ระดับชั้นจาก /api/lookups",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  gradeLevelId?: number;
}
