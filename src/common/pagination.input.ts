import { Field, InputType, Int } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export const Trim = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  );

@InputType({ isAbstract: true })
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page = 1;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 10;
}
