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
  Query,
} from "@nestjs/common";
import {
  CreateStudentDto,
  StudentQueryDto,
  UpdateStudentDto,
} from "./student.dto";
import { StudentService } from "./student.service";
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

@ApiTags("Students")
@ApiBadRequestResponse({ description: "ข้อมูลหรือรูปแบบ id ไม่ถูกต้อง" })
@ApiNotFoundResponse({ description: "ไม่พบนักเรียนหรือข้อมูลหลักที่อ้างอิง" })
@Controller("students")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOperation({
    summary: "ค้นหานักเรียน",
    description:
      "คืน { data, total, page, pageSize } ไม่รวมรายการที่ถูก soft delete",
  })
  @ApiOkResponse({ description: "รายชื่อนักเรียนพร้อมห้องเรียนล่าสุด" })
  findAll(@Query() query: StudentQueryDto) {
    return this.studentService.findAll(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "ดูข้อมูลนักเรียนตาม id" })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.studentService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "เพิ่มนักเรียน" })
  @ApiCreatedResponse({ description: "ข้อมูลนักเรียนที่เพิ่มแล้ว" })
  @ApiConflictResponse({ description: "เลขประจำตัวนักเรียนซ้ำ" })
  create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "แก้ไขนักเรียน",
    description: "ส่งเฉพาะฟิลด์ที่ต้องการแก้ไข อย่างน้อยหนึ่งฟิลด์",
  })
  @ApiConflictResponse({ description: "เลขประจำตัวนักเรียนซ้ำ" })
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({
    summary: "ลบนักเรียนแบบ soft delete",
    description: "ปิดรายการจัดห้องของนักเรียนด้วย เก็บแถวข้อมูลและประวัติไว้",
  })
  @ApiNoContentResponse({ description: "ลบแล้ว ไม่มี response body" })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.studentService.remove(id);
  }
}
