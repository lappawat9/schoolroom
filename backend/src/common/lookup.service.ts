import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Gender, GradeLevel, Prefix, Teacher } from "./lookup.entity";

@Injectable()
export class LookupService {
  constructor(
    @InjectRepository(Prefix) private readonly prefixes: Repository<Prefix>,
    @InjectRepository(Gender) private readonly genders: Repository<Gender>,
    @InjectRepository(GradeLevel)
    private readonly grades: Repository<GradeLevel>,
    @InjectRepository(Teacher) private readonly teachers: Repository<Teacher>,
  ) {}

  async findAll() {
    const [prefixes, genders, grades, teachers] = await Promise.all([
      this.prefixes.find({
        where: { isActive: true },
        order: { sortOrder: "ASC" },
      }),
      this.genders.find({
        where: { isActive: true },
        order: { sortOrder: "ASC" },
      }),
      this.grades.find({ order: { sortOrder: "ASC" } }),
      this.teachers.find({
        relations: { prefix: true },
        order: { firstName: "ASC" },
      }),
    ]);
    return {
      prefixes,
      genders,
      grades,
      teachers: teachers.map((teacher) => ({
        id: teacher.id,
        name: `${teacher.prefix?.name ?? ""}${teacher.firstName} ${teacher.lastName}`,
      })),
    };
  }

  async validateStudent(
    prefixId: number,
    genderId: number,
    gradeLevelId: number,
  ) {
    const [prefix, gender, grade] = await Promise.all([
      this.prefixes.existsBy({ id: prefixId, isActive: true }),
      this.genders.existsBy({ id: genderId, isActive: true }),
      this.grades.existsBy({ id: gradeLevelId }),
    ]);
    if (!prefix || !gender || !grade)
      throw new NotFoundException("คำนำหน้า เพศ หรือระดับชั้นไม่ถูกต้อง");
  }

  async validateClassroom(gradeLevelId: number, teacherId?: number | null) {
    if (!(await this.grades.existsBy({ id: gradeLevelId })))
      throw new NotFoundException("ไม่พบระดับชั้น");
    if (teacherId && !(await this.teachers.existsBy({ id: teacherId })))
      throw new NotFoundException("ไม่พบครูที่เลือก");
  }
}
