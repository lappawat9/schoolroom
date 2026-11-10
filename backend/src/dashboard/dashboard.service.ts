import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Student } from "../students/student.entity";
import { Classroom } from "../classrooms/classroom.entity";
import { activeStudentAssignment } from "../common/student-assignment";

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async summary(academicYear?: number | null) {
    if (academicYear != null &&
      (!Number.isInteger(academicYear) || academicYear < 2400 || academicYear > 3000)) {
      throw new BadRequestException("ปีการศึกษาต้องเป็นจำนวนเต็มระหว่าง 2400–3000");
    }
    return this.dataSource.transaction(async (manager) => {
      const [{ currentYear }] = await manager.query("SELECT YEAR(CURDATE()) + 543 AS currentYear");
      const year = academicYear ?? Number(currentYear);
      const years: { year: number }[] = await manager.getRepository(Classroom)
        .createQueryBuilder("classroom")
        .select("DISTINCT classroom.academicYear", "year")
        .getRawMany();
      const totalStudents = await manager.getRepository(Student).count();
      const totalClassrooms = await manager.getRepository(Classroom).countBy({ academicYear: year });
      const assignedStudents = await manager.getRepository(Student)
        .createQueryBuilder("student")
        .where(`EXISTS (${activeStudentAssignment})`, { assignmentYear: year })
        .getCount();
      return {
        academicYear: year,
        academicYears: [...new Set([Number(currentYear), year, ...years.map((item) => Number(item.year))])]
          .sort((a, b) => b - a),
        totalStudents,
        totalClassrooms,
        assignedStudents,
        unassignedStudents: totalStudents - assignedStudents,
      };
    });
  }
}
