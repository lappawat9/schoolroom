import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { DashboardSummary } from "./dashboard.model.js";
import { DashboardService } from "./dashboard.service.js";

@Resolver(() => DashboardSummary)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => DashboardSummary, { description: "สรุปนักเรียนและการจัดห้องตามปีการศึกษา" })
  dashboard(@Args("academicYear", { type: () => Int, nullable: true }) academicYear?: number) {
    return this.dashboardService.summary(academicYear);
  }
}
