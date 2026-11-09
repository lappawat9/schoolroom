import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Gender, GradeLevel, Prefix, Teacher } from "./lookup.entity";
import { LookupResolver } from "./lookup.resolver";
import { LookupService } from "./lookup.service";

@Module({
  imports: [TypeOrmModule.forFeature([Prefix, Gender, GradeLevel, Teacher])],
  providers: [LookupService, LookupResolver],
  exports: [LookupService],
})
export class LookupModule {}
