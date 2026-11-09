import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Gender, GradeLevel, Prefix } from "../common/lookup.entity";
import { ClassroomStudent } from "../classrooms/classroom-student.entity";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn({ unsigned: true }) id!: number;
  @Column({ name: "student_code", type: "varchar", length: 20, unique: true })
  studentCode!: string;
  @Column({ name: "prefix_id", type: "int" }) prefixId!: number;
  @ManyToOne(() => Prefix)
  @JoinColumn({ name: "prefix_id" })
  prefix!: Prefix;
  @Column({ name: "first_name", type: "varchar", length: 100 })
  firstName!: string;
  @Column({ name: "last_name", type: "varchar", length: 100 })
  lastName!: string;
  @Column({ name: "gender_id", type: "int" }) genderId!: number;
  @ManyToOne(() => Gender)
  @JoinColumn({ name: "gender_id" })
  gender!: Gender;
  @Column({ name: "birth_date", type: "date" }) birthDate!: string;
  @Column({ name: "grade_level_id", type: "int" }) gradeLevelId!: number;
  @ManyToOne(() => GradeLevel)
  @JoinColumn({ name: "grade_level_id" })
  gradeLevel!: GradeLevel;
  @OneToMany(() => ClassroomStudent, (membership) => membership.student)
  memberships!: ClassroomStudent[];
  @CreateDateColumn({ name: "created_at", type: "datetime" }) createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at", type: "datetime" }) updatedAt!: Date;
  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
