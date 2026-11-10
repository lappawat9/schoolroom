import { Query, Resolver } from "@nestjs/graphql";
import { StudentReport } from "./report.model.js";
import { ReportService } from "./report.service.js";

@Resolver(() => StudentReport)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Query(() => StudentReport, {
    description: "รายงานนักเรียนอายุ 10–12 ปี พร้อมห้องที่ยังใช้งานอยู่ทุกปีการศึกษา",
  })
  studentReport() {
    return this.reportService.studentReport();
  }
}
