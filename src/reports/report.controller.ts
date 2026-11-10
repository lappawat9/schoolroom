import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { StudentReportDto } from "./report.dto";
import { ReportService } from "./report.service";

@ApiTags("Reports")
@Controller("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get("students")
  @ApiOperation({ summary: "รายงานนักเรียนอายุ 10–12 ปี พร้อมห้องทุกปีการศึกษา" })
  @ApiOkResponse({ type: StudentReportDto })
  studentReport() {
    return this.reportService.studentReport();
  }
}
