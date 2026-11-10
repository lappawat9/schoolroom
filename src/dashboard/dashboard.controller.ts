import { Controller, Get, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DashboardQueryDto, DashboardSummaryDto } from "./dashboard.dto";
import { DashboardService } from "./dashboard.service";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: "สรุปนักเรียน ห้องเรียน และการจัดห้องตามปีการศึกษา" })
  @ApiOkResponse({ type: DashboardSummaryDto })
  @ApiBadRequestResponse({ description: "ปีการศึกษาต้องเป็นจำนวนเต็มระหว่าง 2400–3000" })
  summary(@Query() query: DashboardQueryDto) {
    return this.dashboardService.summary(query.academicYear);
  }
}
