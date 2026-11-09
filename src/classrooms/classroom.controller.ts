import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { StudentQueryDto } from "../students/student.dto";
import {
  ClassroomQueryDto,
  CreateClassroomDto,
  UpdateClassroomDto,
} from "./classroom.dto";
import { ClassroomService } from "./classroom.service";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Classrooms")
@ApiBadRequestResponse({ description: "ข้อมูลหรือรูปแบบ id ไม่ถูกต้อง" })
@ApiNotFoundResponse({
  description: "ไม่พบห้องเรียน นักเรียน หรือข้อมูลหลักที่อ้างอิง",
})
@Controller("classrooms")
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get()
  @ApiOperation({
    summary: "ค้นหาห้องเรียน",
    description:
      "คืน { data, total, page, pageSize } พร้อมจำนวนนักเรียน ไม่รวมรายการที่ถูก soft delete",
  })
  @ApiOkResponse({ description: "รายการห้องเรียน" })
  findAll(@Query() query: ClassroomQueryDto) {
    return this.classroomService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "ดูข้อมูลห้องเรียนตาม id" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.classroomService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "เพิ่มห้องเรียน" })
  @ApiCreatedResponse({ description: "ข้อมูลห้องเรียนที่เพิ่มแล้ว" })
  @ApiConflictResponse({ description: "เลขห้องซ้ำในปีการศึกษาเดียวกัน" })
  create(@Body() dto: CreateClassroomDto) {
    return this.classroomService.create(dto);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "แก้ไขห้องเรียน",
    description:
      "ส่งเฉพาะฟิลด์ที่ต้องการแก้ไข ส่ง homeroomTeacherId เป็น null เพื่อนำครูออก ห้องที่มีประวัตินักเรียนแล้วเปลี่ยนปีการศึกษาไม่ได้",
  })
  @ApiConflictResponse({
    description: "เลขห้องซ้ำ หรือพยายามเปลี่ยนปีของห้องที่มีประวัติแล้ว",
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateClassroomDto,
  ) {
    return this.classroomService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({
    summary: "ลบห้องเรียนแบบ soft delete",
    description: "ปิดรายการจัดห้องด้วย โดยเก็บข้อมูลนักเรียนไว้",
  })
  @ApiNoContentResponse({ description: "ลบแล้ว ไม่มี response body" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.classroomService.remove(id);
  }

  @Get(":id/students")
  @ApiOperation({
    summary: "ดูนักเรียนในห้องเรียน",
    description: "รองรับตัวกรองและ pagination เช่นเดียวกับ GET /api/students",
  })
  findStudents(
    @Param("id", ParseIntPipe) id: number,
    @Query() query: StudentQueryDto,
  ) {
    return this.classroomService.findStudents(id, query);
  }

  @Put(":id/students/:studentId")
  @ApiOperation({
    summary: "เพิ่มหรือย้ายนักเรียนเข้าห้อง",
    description:
      "ใช้ id ของห้องและนักเรียน ไม่ต้องส่ง body หากมีห้องอื่นในปีการศึกษาเดียวกัน จะย้ายมาห้องนี้โดยเก็บประวัติเดิม",
  })
  @ApiOkResponse({ description: "ข้อมูลนักเรียนหลังจัดห้อง" })
  addStudent(
    @Param("id", ParseIntPipe) id: number,
    @Param("studentId", ParseIntPipe) studentId: number,
  ) {
    return this.classroomService.addStudent(id, studentId);
  }

  @Delete(":id/students/:studentId")
  @ApiOperation({
    summary: "นำนักเรียนออกจากห้อง",
    description: "ไม่ลบนักเรียน คืนข้อมูลนักเรียนหลังนำออก",
  })
  @ApiOkResponse({ description: "ข้อมูลนักเรียนหลังนำออกจากห้อง" })
  @ApiConflictResponse({ description: "นักเรียนไม่ได้อยู่ในห้องนี้แล้ว" })
  removeStudent(
    @Param("id", ParseIntPipe) id: number,
    @Param("studentId", ParseIntPipe) studentId: number,
  ) {
    return this.classroomService.removeStudent(id, studentId);
  }
}
