import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, Repository } from "typeorm";
import { ClassroomStudent } from "../classrooms/classroom-student.entity";
import { LookupService } from "../common/lookup.service";
import { handleDatabaseError } from "../database/handle-database-error";
import {
  CreateStudentDto,
  StudentQueryDto,
  UpdateStudentDto,
} from "./student.dto";
import { Student } from "./student.entity";

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private readonly students: Repository<Student>,
    private readonly lookupService: LookupService,
    private readonly dataSource: DataSource,
  ) {}

  private query() {
    return this.students
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.prefix", "prefix")
      .leftJoinAndSelect("student.gender", "gender")
      .leftJoinAndSelect("student.gradeLevel", "grade")
      .leftJoinAndSelect("student.memberships", "membership")
      .leftJoinAndSelect("membership.classroom", "classroom");
  }

  async findAll(query: StudentQueryDto, classroomId?: number) {
    const qb = this.query();
    if (query.studentCode)
      qb.andWhere("student.studentCode LIKE :code", {
        code: `%${query.studentCode}%`,
      });
    if (query.name) {
      qb.andWhere(
        "(student.firstName LIKE :name OR student.lastName LIKE :name)",
        { name: `%${query.name}%` },
      )
        .addSelect(
          `CASE
            WHEN student.firstName LIKE :nameStart THEN 0
            WHEN student.lastName LIKE :nameStart THEN 1
            ELSE 2
          END`,
          "namePriority",
        )
        .setParameter("nameStart", `${query.name}%`)
        .orderBy("namePriority", "ASC");
    }
    if (query.gradeLevelId)
      qb.andWhere("student.gradeLevelId = :gradeId", {
        gradeId: query.gradeLevelId,
      });
    if (classroomId)
      qb.andWhere("membership.classroomId = :classroomId", { classroomId });

    const [students, total] = await qb
      .addOrderBy("student.studentCode", "ASC")
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getManyAndCount();
    return {
      data: students.map((student) => this.toResponse(student)),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async findOne(id: number) {
    const student = await this.query()
      .where("student.id = :id", { id })
      .getOne();
    if (!student) throw new NotFoundException("ไม่พบข้อมูลนักเรียน");
    return this.toResponse(student);
  }

  async classroomHistory(id: number) {
    await this.findOne(id);
    const result = await this.dataSource
      .getRepository(ClassroomStudent)
      .createQueryBuilder("membership")
      .withDeleted()
      .leftJoinAndSelect("membership.classroom", "classroom")
      .addSelect("UNIX_TIMESTAMP(membership.addedAt)", "historyAddedAt")
      .addSelect("UNIX_TIMESTAMP(membership.deletedAt)", "historyEndedAt")
      .where("membership.studentId = :id", { id })
      .orderBy("membership.academicYear", "DESC")
      .addOrderBy("membership.addedAt", "DESC")
      .addOrderBy("membership.id", "DESC")
      .getRawAndEntities();
    const timestamp = (seconds: number | string) => new Date(Number(seconds) * 1000).toISOString();
    return result.entities.map((membership, index) => ({
      id: membership.id,
      classroomId: membership.classroomId,
      roomNumber: membership.classroom?.roomNumber ?? null,
      roomName: membership.classroom?.name ?? null,
      academicYear: membership.academicYear,
      addedAt: timestamp(result.raw[index].historyAddedAt),
      endedAt: result.raw[index].historyEndedAt === null
        ? null : timestamp(result.raw[index].historyEndedAt),
      classroomDeleted: !!membership.classroom?.deletedAt,
      isActive: !membership.deletedAt && !!membership.classroom && !membership.classroom.deletedAt,
    }));
  }

  async create(dto: CreateStudentDto) {
    this.validateBirthDate(dto.birthDate);
    await this.lookupService.validateStudent(
      dto.prefixId,
      dto.genderId,
      dto.gradeLevelId,
    );
    try {
      const student = await this.students.save(this.students.create(dto));
      return this.findOne(student.id);
    } catch (error) {
      handleDatabaseError(error, "เลขประจำตัวนักเรียนนี้มีอยู่แล้ว");
    }
  }

  async update(id: number, dto: UpdateStudentDto) {
    if (!Object.keys(dto).length)
      throw new BadRequestException("กรุณาระบุข้อมูลที่ต้องการแก้ไข");
    const student = await this.findOne(id);
    if (dto.birthDate !== undefined) this.validateBirthDate(dto.birthDate);
    await this.lookupService.validateStudent(
      dto.prefixId ?? student.prefixId,
      dto.genderId ?? student.genderId,
      dto.gradeLevelId ?? student.gradeLevelId,
    );
    try {
      await this.students.update(id, dto);
    } catch (error) {
      handleDatabaseError(error, "เลขประจำตัวนักเรียนนี้มีอยู่แล้ว");
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.dataSource.transaction(async (manager) => {
      const student = await manager.findOne(Student, {
        where: { id },
        ...(this.dataSource.options.type === "mysql"
          ? { lock: { mode: "pessimistic_write" as const } }
          : {}),
      });
      if (!student) throw new NotFoundException("ไม่พบข้อมูลนักเรียน");
      await manager.softDelete(ClassroomStudent, {
        studentId: id,
        deletedAt: IsNull(),
      });
      await manager.softDelete(Student, id);
    });
  }

  private validateBirthDate(birthDate: string) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) ||
      birthDate > new Date().toISOString().slice(0, 10)
    ) {
      throw new BadRequestException(
        "วันเกิดต้องเป็น YYYY-MM-DD และไม่อยู่ในอนาคต",
      );
    }
  }

  private toResponse(student: Student) {
    const { memberships = [], prefix, gender, gradeLevel, ...data } = student;
    const rooms = memberships
      .filter((item) => item.classroom)
      .sort((a, b) => b.academicYear - a.academicYear || b.id - a.id);
    const classroom = rooms[0]?.classroom ?? null;
    return {
      ...data,
      prefix: prefix?.name ?? "",
      gender: gender?.code === "M" ? "male" : "female",
      gradeLevel: gradeLevel?.name ?? "",
      enrollmentYear: 2500 + Number(student.studentCode.slice(0, 2)),
      classroomId: classroom?.id ?? null,
      classroom,
      classrooms: rooms.map((item) => item.classroom),
    };
  }
}
