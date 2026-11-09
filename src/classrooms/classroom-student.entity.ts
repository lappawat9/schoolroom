import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Student } from "../students/student.entity";
import { Classroom } from "./classroom.entity";

@Entity("classroom_students")
export class ClassroomStudent {
  @PrimaryGeneratedColumn({ unsigned: true }) id!: number;
  @Column({ name: "classroom_id", type: "int" }) classroomId!: number;
  @ManyToOne(() => Classroom)
  @JoinColumn({ name: "classroom_id" })
  classroom!: Relation<Classroom>;
  @Column({ name: "student_id", type: "int" }) studentId!: number;
  @ManyToOne(() => Student)
  @JoinColumn({ name: "student_id" })
  student!: Relation<Student>;
  @Column({ name: "academic_year", type: "int" }) academicYear!: number;
  @CreateDateColumn({ name: "added_at", type: "datetime" }) addedAt!: Date;
  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
