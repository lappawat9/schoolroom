import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min, Max } from "class-validator";

export class DashboardQueryDto {
  @ApiPropertyOptional({ type: Number, minimum: 2400, maximum: 3000, description: "ปีการศึกษา พ.ศ. ค่าเริ่มต้นคือปีปัจจุบันของฐานข้อมูล" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2400)
  @Max(3000)
  academicYear?: number;
}

export class DashboardSummaryDto {
  @ApiProperty() academicYear!: number;
  @ApiProperty({ type: [Number] }) academicYears!: number[];
  @ApiProperty({ description: "นักเรียนที่ยังใช้งานอยู่ทั้งหมด" }) totalStudents!: number;
  @ApiProperty({ description: "ห้องเรียนที่ยังใช้งานอยู่ในปีที่เลือก" }) totalClassrooms!: number;
  @ApiProperty() assignedStudents!: number;
  @ApiProperty() unassignedStudents!: number;
}
