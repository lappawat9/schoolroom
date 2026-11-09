import { Controller, Get } from "@nestjs/common";
import { LookupService } from "./lookup.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Lookups")
@Controller("lookups")
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Get()
  @ApiOperation({
    summary: "ดูตัวเลือกสำหรับกรอกฟอร์ม",
    description:
      "คืน prefixes, genders, grades และ teachers ให้นำ id ไปใช้เพิ่มหรือแก้ไขนักเรียนและห้องเรียน",
  })
  findAll() {
    return this.lookupService.findAll();
  }
}
