import "reflect-metadata";
import assert from "node:assert/strict";
import { test } from "node:test";
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import request from "supertest";
import { configureApp } from "../src/configure-app";
import { StudentModule } from "../src/students/student.module";
import { ClassroomModule } from "../src/classrooms/classroom.module";
import { Student } from "../src/students/student.entity";
import { Classroom } from "../src/classrooms/classroom.entity";
import { ClassroomStudent } from "../src/classrooms/classroom-student.entity";
import {
  Prefix,
  Gender,
  GradeLevel,
  Teacher,
} from "../src/common/lookup.entity";

test("student and classroom API", async (t) => {
  const module = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: "sqljs",
        entities: [
          Student,
          Classroom,
          ClassroomStudent,
          Prefix,
          Gender,
          GradeLevel,
          Teacher,
        ],
        synchronize: true,
      }),
      StudentModule,
      ClassroomModule,
    ],
  }).compile();
  const app = module.createNestApplication();
  configureApp(app);
  await app.init();
  t.after(() => app.close());
  const source = module.get(DataSource);
  await source.getRepository(Gender).save({
    id: 1,
    code: "M",
    name: "ชาย",
    nameEn: "Male",
    sortOrder: 1,
    isActive: true,
  });
  await source.getRepository(Prefix).save({
    id: 1,
    name: "เด็กชาย",
    shortName: "ด.ช.",
    genderId: 1,
    sortOrder: 1,
    isActive: true,
  });
  await source.getRepository(GradeLevel).save({
    id: 1,
    code: "P1",
    name: "ป.1",
    fullName: "ประถมศึกษาปีที่ 1",
    stage: "PRIMARY",
    sortOrder: 1,
  });
  const http = request(app.getHttpServer());
  await t.test(
    "Swagger exposes request schemas, query parameters, and UI assets",
    async () => {
      const document = (await http.get("/api/docs-json").expect(200)).body;
      assert.equal(document.info.title, "Schoolroom API");
      const schemas = document.components.schemas;
      assert.ok(schemas.CreateStudentDto.required.includes("gradeLevelId"));
      assert.equal(
        schemas.CreateStudentDto.properties.birthDate.format,
        "date",
      );
      assert.ok(!schemas.UpdateStudentDto.required?.length);
      assert.ok(
        !schemas.CreateClassroomDto.required.includes("homeroomTeacherId"),
      );
      assert.equal(
        schemas.CreateClassroomDto.properties.homeroomTeacherId.nullable,
        true,
      );
      const queryNames = document.paths["/api/students"].get.parameters.map(
        (parameter: { name: string }) => parameter.name,
      );
      assert.ok(queryNames.includes("page"));
      assert.ok(queryNames.includes("gradeLevelId"));
      assert.ok(
        document.paths["/api/classrooms/{id}/students/{studentId}"].put,
      );
      assert.ok(document.paths["/api/students/{id}"].delete.responses["204"]);
      await http
        .get("/api/docs")
        .expect(200)
        .expect(/swagger-ui/);
      await http.get("/api/docs/swagger-ui-init.js").expect(200);
      await http.get("/api/docs/swagger-ui.css").expect(200);
      await http.get("/api/docs/swagger-ui-bundle.js").expect(200);
    },
  );
  const student = {
    studentCode: "69001",
    prefixId: 1,
    firstName: "ทดสอบ",
    lastName: "ระบบ",
    genderId: 1,
    birthDate: "2015-05-15",
    gradeLevelId: 1,
  };
  const classroom = {
    roomNumber: "111",
    name: "ป.1/1",
    academicYear: 2569,
    gradeLevelId: 1,
    homeroomTeacherId: null,
  };
  let studentId: number, roomA: number, roomB: number, nextYearRoom: number;

  await t.test("validates input and reads master data", async () => {
    await http.post("/api/students").send({}).expect(400);
    await http
      .post("/api/students")
      .send({ ...student, firstName: "   " })
      .expect(400);
    await http
      .post("/api/students")
      .send({ ...student, birthDate: "2023-02-30" })
      .expect(400);
    await http
      .post("/api/students")
      .send({ ...student, birthDate: "2999-01-01" })
      .expect(400);
    await http
      .post("/api/students")
      .send({ ...student, prefixId: 9999 })
      .expect(404);
    await http
      .post("/api/students")
      .send({ ...student, arbitrary: true })
      .expect(400);
    await http.get("/api/students?pageSize=101").expect(400);
    await http.get("/api/students?page=0").expect(400);
    const lookup = (await http.get("/api/lookups").expect(200)).body;
    assert.equal(lookup.grades[0].name, "ป.1");
  });

  await t.test(
    "creates, filters, and edits students and classrooms",
    async () => {
      studentId = (await http.post("/api/students").send(student).expect(201))
        .body.id;
      await http.post("/api/students").send(student).expect(409);
      roomA = (await http.post("/api/classrooms").send(classroom).expect(201))
        .body.id;
      await http.post("/api/classrooms").send(classroom).expect(409);
      roomB = (
        await http
          .post("/api/classrooms")
          .send({ ...classroom, roomNumber: "112", name: "ป.1/2" })
          .expect(201)
      ).body.id;
      nextYearRoom = (
        await http
          .post("/api/classrooms")
          .send({ ...classroom, academicYear: 2570 })
          .expect(201)
      ).body.id;
      await http
        .patch(`/api/students/${studentId}`)
        .send({ firstName: "ชื่อใหม่" })
        .expect(200);
      await http
        .patch(`/api/students/${studentId}`)
        .send({ firstName: null })
        .expect(400);
      await http.patch(`/api/students/${studentId}`).send({}).expect(400);
      await http
        .patch(`/api/classrooms/${roomB}`)
        .send({ name: "ห้องสอง" })
        .expect(200);
      await http.patch(`/api/classrooms/${roomA}`).send({}).expect(400);
      const found = (
        await http
          .get("/api/students")
          .query({ name: "ระบบ", gradeLevelId: 1, studentCode: "69" })
          .expect(200)
      ).body;
      assert.equal(found.total, 1);
      assert.equal(found.data[0].prefix, "เด็กชาย");
      assert.equal(found.data[0].enrollmentYear, 2569);
      assert.equal(
        (
          await http
            .get("/api/students")
            .query({ name: "' OR 1=1 --" })
            .expect(200)
        ).body.total,
        0,
      );
    },
  );

  await t.test(
    "transfers within one academic year and preserves membership history",
    async () => {
      await http
        .put(`/api/classrooms/${roomA}/students/${studentId}`)
        .expect(200);
      await http
        .put(`/api/classrooms/${roomA}/students/${studentId}`)
        .expect(200);
      assert.equal(await source.getRepository(ClassroomStudent).count(), 1);
      await http
        .put(`/api/classrooms/${roomB}/students/${studentId}`)
        .expect(200);
      await http
        .delete(`/api/classrooms/${roomA}/students/${studentId}`)
        .expect(409);
      assert.equal(
        (await http.get(`/api/classrooms/${roomB}/students`).expect(200)).body
          .total,
        1,
      );
      assert.equal(
        await source
          .getRepository(ClassroomStudent)
          .count({ withDeleted: true }),
        2,
      );
      const rooms = (await http.get("/api/classrooms").expect(200)).body.data;
      assert.equal(
        rooms.find((room: { id: number }) => room.id === roomB).studentCount,
        1,
      );
      await http
        .patch(`/api/classrooms/${roomB}`)
        .send({ academicYear: 2571 })
        .expect(409);
    },
  );

  await t.test("keeps assignments from different academic years", async () => {
    await http
      .put(`/api/classrooms/${nextYearRoom}/students/${studentId}`)
      .expect(200);
    const found = (await http.get(`/api/students/${studentId}`).expect(200))
      .body;
    assert.equal(found.classroomId, nextYearRoom);
    assert.equal(found.classrooms.length, 2);
    await http
      .delete(`/api/classrooms/${nextYearRoom}/students/${studentId}`)
      .expect(200);
    assert.equal(
      (await http.get(`/api/students/${studentId}`).expect(200)).body
        .classroomId,
      roomB,
    );
  });

  await t.test(
    "soft-deletes classrooms and memberships without deleting students",
    async () => {
      const oldHistory = await source
        .getRepository(ClassroomStudent)
        .find({ withDeleted: true, where: { classroomId: roomA } });
      await http.delete(`/api/classrooms/${roomA}`).expect(204);
      const retainedHistory = await source
        .getRepository(ClassroomStudent)
        .find({ withDeleted: true, where: { classroomId: roomA } });
      assert.equal(
        retainedHistory[0].deletedAt?.getTime(),
        oldHistory[0].deletedAt?.getTime(),
      );
      await http.delete(`/api/classrooms/${roomB}`).expect(204);
      await http.get(`/api/classrooms/${roomB}`).expect(404);
      assert.ok(
        (
          await source
            .getRepository(Classroom)
            .findOne({ where: { id: roomB }, withDeleted: true })
        )?.deletedAt,
      );
      assert.equal(
        (await http.get(`/api/students/${studentId}`).expect(200)).body
          .classroomId,
        null,
      );
    },
  );

  await t.test(
    "soft-deletes students and returns 404 for deleted records",
    async () => {
      await http.delete(`/api/students/${studentId}`).expect(204);
      await http.get(`/api/students/${studentId}`).expect(404);
      await http.delete(`/api/students/${studentId}`).expect(404);
      assert.ok(
        (
          await source
            .getRepository(Student)
            .findOne({ where: { id: studentId }, withDeleted: true })
        )?.deletedAt,
      );
      assert.equal((await http.get("/api/students").expect(200)).body.total, 0);
      await http
        .put(`/api/classrooms/${nextYearRoom}/students/${studentId}`)
        .expect(404);
    },
  );
});
