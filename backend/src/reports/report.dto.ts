import { ApiProperty } from "@nestjs/swagger";

export class StudentReportRowDto {
  @ApiProperty() studentCode!: string;
  @ApiProperty() fullName!: string;
  @ApiProperty() gender!: string;
  @ApiProperty({ type: Number }) age!: number;
  @ApiProperty({ type: String, nullable: true }) roomNumber!: string | null;
  @ApiProperty({ type: String, nullable: true }) roomName!: string | null;
  @ApiProperty({ type: Number, nullable: true }) academicYear!: number | null;
}

export class StudentReportDto {
  @ApiProperty({ example: "2026-11-10", description: "วันที่ใช้คำนวณอายุจาก MySQL" })
  asOfDate!: string;
  @ApiProperty({ type: [StudentReportRowDto] }) rows!: StudentReportRowDto[];
}
