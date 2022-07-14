import { Unit } from "../entities/unit.entity";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Reservation } from "../entities/reservation.entitiy";
import { AppDataSource } from "../data-source";
import { Timestamp } from "typeorm";

@Resolver(Reservation)
class ReservationResolver {
  @Query(() => [Reservation])
  async reservations() {
    return Reservation.find({});
  }

  @Mutation(() => Reservation)
  createReservation(
    @Arg("unitID") unit_id: number,
    @Arg("guestName") guest_name: string,
    @Arg("checkIn") check_in: Date,
    @Arg("checkOut") check_out: Date
  ) {
    const reservation = Reservation.create({
      unit_id,
      guest_name,
      check_in,
      check_out,
    });
    return reservation.save();
  }

  @FieldResolver(() => Unit)
  unit(@Root() reservation: Reservation) {
    return Unit.findOneBy({ id: reservation.unit_id });
  }
}
