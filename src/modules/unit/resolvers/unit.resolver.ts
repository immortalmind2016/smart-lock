import { Unit } from "../entities/unit.entity";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Unit)
class UnitResolver {
  @Query(() => [Unit])
  async units() {
    return Unit.find({});
  }

  @Mutation(() => Unit)
  createUnit(@Arg("unit_name", { nullable: false }) unit_name: string) {
    console.log({ unit_name });
    const unit = Unit.create({ unit_name });
    return unit.save();
  }
}
