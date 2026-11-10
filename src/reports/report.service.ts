import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { StudentReportDto, StudentReportRowDto } from "./report.dto";

@Injectable()
export class ReportService {
  constructor(private readonly dataSource: DataSource) {}

  async studentReport(): Promise<StudentReportDto> {
    return this.dataSource.transaction(async (manager) => {
      const [{ asOfDate }] = await manager.query(
        "SELECT DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS asOfDate",
      );

      const rows: StudentReportRowDto[] = await manager.query(
        `SELECT
          s.student_code AS studentCode,
          CONCAT(s.first_name, ' ', s.last_name) AS fullName,
          g.name AS gender,
          TIMESTAMPDIFF(YEAR, s.birth_date, ?) AS age,
          c.room_no AS roomNumber,
          c.room_name AS roomName,
          c.academic_year AS academicYear
        FROM students AS s
        JOIN master_gender AS g ON g.id = s.gender_id
        LEFT JOIN (
          SELECT membership.student_id, room.room_no, room.room_name, room.academic_year
          FROM classroom_students AS membership
          JOIN classrooms AS room ON room.id = membership.classroom_id
          WHERE membership.deleted_at IS NULL AND room.deleted_at IS NULL
        ) AS c ON c.student_id = s.id
        WHERE s.deleted_at IS NULL
          AND TIMESTAMPDIFF(YEAR, s.birth_date, ?) BETWEEN 10 AND 12
        ORDER BY s.student_code, c.academic_year, c.room_no`,
        [asOfDate, asOfDate],
      );
      return {
        asOfDate,
        rows: rows.map((row) => ({ ...row, age: Number(row.age) })),
      };
    });
  }
}
