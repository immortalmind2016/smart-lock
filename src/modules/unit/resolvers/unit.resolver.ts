import { Unit } from "../entities/unit.entity";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { unitService } from "./unit.service";

@Resolver(Unit)
class UnitResolver {
  @Query(() => [Unit])
  async units() {
    return unitService.find();
  }

  @Mutation(() => Unit)
  createUnit(@Arg("unit_name", { nullable: false }) unit_name: string) {
    return unitService.create({ unit_name });
  }
}
