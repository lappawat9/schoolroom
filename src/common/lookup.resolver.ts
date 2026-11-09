import { Query, Resolver } from "@nestjs/graphql";
import { Lookups } from "./lookup.model";
import { LookupService } from "./lookup.service";

@Resolver(() => Lookups)
export class LookupResolver {
  constructor(private readonly lookupService: LookupService) {}

  @Query(() => Lookups, { description: "ตัวเลือกคำนำหน้า เพศ ระดับชั้น และครู" })
  lookups() {
    return this.lookupService.findAll();
  }
}
