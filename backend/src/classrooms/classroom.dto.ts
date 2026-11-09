import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { PaginationDto, Trim } from "../common/query.dto";

export class CreateClassroomDto {
  @ApiProperty({
    example: "111",
    maxLength: 20,
    description: "เลขห้อง ต้องไม่ซ้ำในปีการศึกษาเดียวกัน",
  })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  roomNumber!: string;

  @ApiProperty({ example: "ป.1/1", minLength: 1, maxLength: 100 })
  @Trim()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 2569,
    minimum: 2400,
    maximum: 3000,
    description: "ปีการศึกษา พ.ศ.",
  })
  @IsInt()
  @Min(2400)
  @Max(3000)
  academicYear!: number;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: "id ระดับชั้นจาก /api/lookups",
  })
  @IsInt()
  @Min(1)
  gradeLevelId!: number;

  @ApiPropertyOptional({
    type: Number,
    example: null,
    nullable: true,
    minimum: 1,
    description: "id ครูจาก /api/lookups ส่ง null เมื่อยังไม่กำหนดครู",
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  homeroomTeacherId?: number | null;
}

export class UpdateClassroomDto extends PartialType(CreateClassroomDto, {
  skipNullProperties: false,
}) {}

export class ClassroomQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    example: "11",
    maxLength: 20,
    description: "ค้นหาบางส่วนของเลขห้อง",
  })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(20)
  roomNumber?: string;

  @ApiPropertyOptional({
    example: "ป.1",
    maxLength: 100,
    description: "ค้นหาบางส่วนของชื่อห้อง",
  })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: "สมใจ",
    maxLength: 150,
    description: "ค้นหาบางส่วนของชื่อหรือนามสกุลครู",
  })
  @IsOptional()
  @Trim()
  @IsString()
  @MaxLength(150)
  teacherName?: string;
}
