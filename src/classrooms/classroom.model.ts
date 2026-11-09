import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("Classroom")
export class ClassroomModel {
  @Field(() => Int) id!: number;
  @Field() roomNumber!: string;
  @Field() name!: string;
  @Field(() => Int) academicYear!: number;
  @Field(() => Int) gradeLevelId!: number;
  @Field() gradeLevel!: string;
  @Field(() => Int, { nullable: true }) homeroomTeacherId!: number | null;
  @Field() teacherName!: string;
  @Field(() => Int, { nullable: true }) studentCount?: number;
}

@ObjectType()
export class ClassroomPage {
  @Field(() => [ClassroomModel]) data!: ClassroomModel[];
  @Field(() => Int) total!: number;
  @Field(() => Int) page!: number;
  @Field(() => Int) pageSize!: number;
}
