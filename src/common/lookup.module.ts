import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Gender, GradeLevel, Prefix, Teacher } from "./lookup.entity";
import { LookupController } from "./lookup.controller";
import { LookupService } from "./lookup.service";

@Module({
  imports: [TypeOrmModule.forFeature([Prefix, Gender, GradeLevel, Teacher])],
  controllers: [LookupController],
  providers: [LookupService],
  exports: [LookupService],
})
export class LookupModule {}
