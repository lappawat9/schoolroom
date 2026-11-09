import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
class PrefixOption {
  @Field(() => Int) id!: number;
  @Field() name!: string;
  @Field(() => Int, { nullable: true }) genderId!: number | null;
}

@ObjectType()
class GenderOption {
  @Field(() => Int) id!: number;
  @Field() code!: string;
  @Field() name!: string;
}

@ObjectType()
class LookupOption {
  @Field(() => Int) id!: number;
  @Field() name!: string;
}

@ObjectType()
export class Lookups {
  @Field(() => [PrefixOption]) prefixes!: PrefixOption[];
  @Field(() => [GenderOption]) genders!: GenderOption[];
  @Field(() => [LookupOption]) grades!: LookupOption[];
  @Field(() => [LookupOption]) teachers!: LookupOption[];
}
