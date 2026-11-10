import { Module } from "@nestjs/common";
import { DashboardResolver } from "./dashboard.resolver.js";
import { DashboardService } from "./dashboard.service.js";

@Module({ providers: [DashboardService, DashboardResolver] })
export class DashboardModule {}
