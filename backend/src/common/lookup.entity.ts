import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("master_prefix")
export class Prefix {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ type: "varchar", length: 50 }) name!: string;
  @Column({ name: "short_name", type: "varchar", length: 20 })
  shortName!: string;
  @Column({ name: "gender_id", type: "int", nullable: true }) genderId!:
    | number
    | null;
  @Column({ name: "sort_order", type: "int" }) sortOrder!: number;
  @Column({ name: "is_active", type: "boolean" }) isActive!: boolean;
}

@Entity("master_gender")
export class Gender {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ type: "varchar", length: 1 }) code!: string;
  @Column({ type: "varchar", length: 20 }) name!: string;
  @Column({ name: "name_en", type: "varchar", length: 20 }) nameEn!: string;
  @Column({ name: "sort_order", type: "int" }) sortOrder!: number;
  @Column({ name: "is_active", type: "boolean" }) isActive!: boolean;
}

@Entity("grade_levels")
export class GradeLevel {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ type: "varchar", length: 10 }) code!: string;
  @Column({ type: "varchar", length: 50 }) name!: string;
  @Column({ name: "full_name", type: "varchar", length: 100 })
  fullName!: string;
  @Column({ type: "varchar", length: 20 }) stage!: string;
  @Column({ name: "sort_order", type: "int" }) sortOrder!: number;
}

@Entity("teachers")
export class Teacher {
  @PrimaryGeneratedColumn({ unsigned: true }) id!: number;
  @Column({ name: "teacher_code", type: "varchar", length: 20 })
  teacherCode!: string;
  @Column({ name: "prefix_id", type: "int" }) prefixId!: number;
  @ManyToOne(() => Prefix)
  @JoinColumn({ name: "prefix_id" })
  prefix!: Prefix;
  @Column({ name: "first_name", type: "varchar", length: 100 })
  firstName!: string;
  @Column({ name: "last_name", type: "varchar", length: 100 })
  lastName!: string;
  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt!: Date | null;
}
