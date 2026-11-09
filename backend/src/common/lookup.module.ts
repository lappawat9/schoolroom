import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Gender, GradeLevel, Prefix, Teacher } from "./lookup.entity.js";
import { LookupResolver } from "./lookup.resolver.js";
import { LookupService } from "./lookup.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([Prefix, Gender, GradeLevel, Teacher])],
  providers: [LookupService, LookupResolver],
  exports: [LookupService],
})
export class LookupModule {}
