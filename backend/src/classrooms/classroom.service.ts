import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  DataSource,
  EntityManager,
  In,
  IsNull,
  Not,
  Repository,
} from "typeorm";
import { LookupService } from "../common/lookup.service";
import { Student } from "../students/student.entity";
import { StudentQueryDto } from "../students/student.dto";
import { StudentService } from "../students/student.service";
import {
  ClassroomQueryDto,
  CreateClassroomDto,
  UpdateClassroomDto,
} from "./classroom.dto";
import { Classroom } from "./classroom.entity";
import { ClassroomStudent } from "./classroom-student.entity";

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classrooms: Repository<Classroom>,
    private readonly studentService: StudentService,
    private readonly lookupService: LookupService,
    private readonly dataSource: DataSource,
  ) {}

  private query() {
    return this.classrooms
      .createQueryBuilder("classroom")
      .leftJoinAndSelect("classroom.teacher", "teacher")
      .leftJoinAndSelect("teacher.prefix", "prefix")
      .leftJoinAndSelect("classroom.gradeLevel", "grade");
  }

  async findAll(query: ClassroomQueryDto) {
    const qb = this.query();
    if (query.roomNumber)
      qb.andWhere("classroom.roomNumber LIKE :roomNumber", {
        roomNumber: `%${query.roomNumber}%`,
      });
    if (query.name)
      qb.andWhere("classroom.name LIKE :name", { name: `%${query.name}%` });
    if (query.teacherName) {
      qb.andWhere(
        `(teacher.firstName LIKE :teacher OR teacher.lastName LIKE :teacher
          OR CONCAT(teacher.firstName, teacher.lastName) LIKE :fullName
          OR CONCAT(COALESCE(prefix.name, ''), teacher.firstName, teacher.lastName) LIKE :fullName)`,
        {
          teacher: `%${query.teacherName}%`,
          fullName: `%${query.teacherName.replace(/\s+/g, "")}%`,
        },
      )
        .addSelect(
          `CASE
            WHEN teacher.firstName LIKE :teacherStart
              OR CONCAT(teacher.firstName, teacher.lastName) LIKE :teacherFullStart THEN 0
            WHEN teacher.lastName LIKE :teacherStart THEN 1
            WHEN CONCAT(COALESCE(prefix.name, ''), teacher.firstName, teacher.lastName) LIKE :teacherFullStart THEN 2
            ELSE 3
          END`,
          "teacherPriority",
        )
        .setParameters({
          teacherStart: `${query.teacherName}%`,
          teacherFullStart: `${query.teacherName.replace(/\s+/g, "")}%`,
        })
        .orderBy("teacherPriority", "ASC");
    }

    const total = await qb.getCount();
    const result = await qb
      .addSelect(
        (sub) =>
          sub
            .select("COUNT(*)")
            .from(ClassroomStudent, "membership")
            .innerJoin("membership.student", "student")
            .where("membership.classroomId = classroom.id"),
        "studentCount",
      )
      .addOrderBy("classroom.academicYear", "DESC")
      .addOrderBy("classroom.roomNumber", "ASC")
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getRawAndEntities();
    const data = result.entities.map((classroom, index) => ({
      ...this.toResponse(classroom),
      studentCount: Number(result.raw[index].studentCount),
    }));
    return { data, total, page: query.page, pageSize: query.pageSize };
  }

  async findOne(id: number) {
    const classroom = await this.query()
      .where("classroom.id = :id", { id })
      .getOne();
    if (!classroom) throw new NotFoundException("ไม่พบข้อมูลห้องเรียน");
    return this.toResponse(classroom);
  }

  async create(dto: CreateClassroomDto) {
    await this.lookupService.validateClassroom(
      dto.gradeLevelId,
      dto.homeroomTeacherId,
    );
    await this.checkDuplicate(dto.roomNumber, dto.academicYear);
    const classroom = await this.classrooms.save(
      this.classrooms.create({
        ...dto,
        homeroomTeacherId: dto.homeroomTeacherId ?? null,
      }),
    );
    return this.findOne(classroom.id);
  }

  async update(id: number, dto: UpdateClassroomDto) {
    if (!Object.keys(dto).length)
      throw new BadRequestException("กรุณาระบุข้อมูลที่ต้องการแก้ไข");
    await this.dataSource.transaction(async (manager) => {
      const classroom = await this.lockClassroom(manager, id);
      const teacherId =
        dto.homeroomTeacherId === undefined
          ? classroom.homeroomTeacherId
          : dto.homeroomTeacherId;
      await this.lookupService.validateClassroom(
        dto.gradeLevelId ?? classroom.gradeLevelId,
        teacherId,
        manager,
      );
      await this.checkDuplicate(
        dto.roomNumber ?? classroom.roomNumber,
        dto.academicYear ?? classroom.academicYear,
        id,
        manager,
      );
      if (
        dto.academicYear !== undefined &&
        dto.academicYear !== classroom.academicYear
      ) {
        const members = await manager
          .getRepository(ClassroomStudent)
          .createQueryBuilder("membership")
          .innerJoin("membership.student", "student")
          .where("membership.classroomId = :id", { id })
          .orderBy("membership.studentId", "ASC")
          .getMany();
        for (const member of members)
          await this.lockStudent(manager, member.studentId);
        if (members.length) {
          const conflict = await manager.findOne(ClassroomStudent, {
            where: {
              studentId: In(members.map((member) => member.studentId)),
              academicYear: dto.academicYear,
              classroomId: Not(id),
            },
            ...(this.dataSource.options.type === "mysql"
              ? { lock: { mode: "pessimistic_write" as const } }
              : {}),
          });
          if (conflict)
            throw new ConflictException(
              "มีนักเรียนอยู่ในห้องอื่นของปีการศึกษานี้แล้ว กรุณาจัดห้องใหม่ก่อนเปลี่ยนปี",
            );
        }
        await manager.update(
          ClassroomStudent,
          { classroomId: id },
          { academicYear: dto.academicYear },
        );
      }
      await manager.update(Classroom, id, dto);
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.dataSource.transaction(async (manager) => {
      await this.lockClassroom(manager, id);
      await manager.softDelete(ClassroomStudent, {
        classroomId: id,
        deletedAt: IsNull(),
      });
      await manager.softDelete(Classroom, id);
    });
  }

  async findStudents(id: number, query: StudentQueryDto) {
    await this.findOne(id);
    return this.studentService.findAll(query, id);
  }

  async addStudent(classroomId: number, studentId: number) {
    await this.dataSource.transaction(async (manager) => {
      const classroom = await this.lockClassroom(manager, classroomId);
      await this.lockStudent(manager, studentId);
      const memberships = manager.getRepository(ClassroomStudent);
      const active = await memberships.find({
        where: { studentId, academicYear: classroom.academicYear },
      });
      if (active.length === 1 && active[0].classroomId === classroomId) return;
      for (const membership of active)
        await memberships.softDelete(membership.id);
      await memberships.save(
        memberships.create({
          classroomId,
          studentId,
          academicYear: classroom.academicYear,
        }),
      );
    });
    return this.studentService.findOne(studentId);
  }

  async removeStudent(classroomId: number, studentId: number) {
    await this.dataSource.transaction(async (manager) => {
      await this.lockClassroom(manager, classroomId);
      await this.lockStudent(manager, studentId);
      const membership = await manager.findOneBy(ClassroomStudent, {
        classroomId,
        studentId,
      });
      if (!membership)
        throw new ConflictException("นักเรียนไม่ได้อยู่ในห้องนี้แล้ว");
      await manager.softDelete(ClassroomStudent, membership.id);
    });
    return this.studentService.findOne(studentId);
  }

  private async checkDuplicate(
    roomNumber: string,
    academicYear: number,
    id?: number,
    manager = this.classrooms.manager,
  ) {
    const exists = await manager.getRepository(Classroom).existsBy({
      roomNumber,
      academicYear,
      ...(id ? { id: Not(id) } : {}),
    });
    if (exists)
      throw new ConflictException("เลขห้องนี้มีอยู่แล้วในปีการศึกษาที่เลือก");
  }

  private async lockClassroom(manager: EntityManager, id: number) {
    const classroom = await manager.findOne(Classroom, {
      where: { id },
      ...(this.dataSource.options.type === "mysql"
        ? { lock: { mode: "pessimistic_write" as const } }
        : {}),
    });
    if (!classroom) throw new NotFoundException("ไม่พบข้อมูลห้องเรียน");
    return classroom;
  }

  private async lockStudent(manager: EntityManager, id: number) {
    const student = await manager.findOne(Student, {
      where: { id },
      ...(this.dataSource.options.type === "mysql"
        ? { lock: { mode: "pessimistic_write" as const } }
        : {}),
    });
    if (!student) throw new NotFoundException("ไม่พบข้อมูลนักเรียน");
  }

  private toResponse(classroom: Classroom) {
    const { teacher, gradeLevel, ...data } = classroom;
    return {
      ...data,
      gradeLevel: gradeLevel?.name ?? "",
      teacherName: teacher
        ? `${teacher.prefix?.name ?? ""}${teacher.firstName} ${teacher.lastName}`
        : "",
    };
  }
}
