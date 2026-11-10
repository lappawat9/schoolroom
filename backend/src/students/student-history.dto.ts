import { ApiProperty } from "@nestjs/swagger";

export class StudentClassroomHistoryDto {
  @ApiProperty() id!: number;
  @ApiProperty() classroomId!: number;
  @ApiProperty({ type: String, nullable: true }) roomNumber!: string | null;
  @ApiProperty({ type: String, nullable: true }) roomName!: string | null;
  @ApiProperty() academicYear!: number;
  @ApiProperty({ format: "date-time" }) addedAt!: string;
  @ApiProperty({ type: String, format: "date-time", nullable: true }) endedAt!: string | null;
  @ApiProperty() classroomDeleted!: boolean;
  @ApiProperty() isActive!: boolean;
}
