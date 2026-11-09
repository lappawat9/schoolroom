import { Query, Resolver } from "@nestjs/graphql";
import { Lookups } from "./lookup.model.js";
import { LookupService } from "./lookup.service.js";

@Resolver(() => Lookups)
export class LookupResolver {
  constructor(private readonly lookupService: LookupService) {}

  @Query(() => Lookups, { description: "ตัวเลือกคำนำหน้า เพศ ระดับชั้น และครู" })
  lookups() {
    return this.lookupService.findAll();
  }
}
