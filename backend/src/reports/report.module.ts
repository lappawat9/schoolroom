import { Module } from "@nestjs/common";
import { ReportResolver } from "./report.resolver.js";
import { ReportService } from "./report.service.js";

@Module({ providers: [ReportService, ReportResolver] })
export class ReportModule {}
