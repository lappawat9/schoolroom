import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { GradeLevel, Teacher } from "../common/lookup.entity.js";

@Entity("classrooms")
export class Classroom {
  @PrimaryGeneratedColumn({ unsigned: true }) id!: number;
  @Column({ name: "room_no", type: "varchar", length: 20 }) roomNumber!: string;
  @Column({ name: "room_name", type: "varchar", length: 100 }) name!: string;
  @Column({ name: "academic_year", type: "int" }) academicYear!: number;
  @Column({ name: "grade_level_id", type: "int" }) gradeLevelId!: number;
  @ManyToOne(() => GradeLevel)
  @JoinColumn({ name: "grade_level_id" })
  gradeLevel!: GradeLevel;
  @Column({ name: "homeroom_teacher_id", type: "int", nullable: true })
  homeroomTeacherId!: number | null;
  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: "homeroom_teacher_id" })
  teacher!: Teacher | null;
  @CreateDateColumn({ name: "created_at", type: "datetime" }) createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at", type: "datetime" }) updatedAt!: Date;
  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
