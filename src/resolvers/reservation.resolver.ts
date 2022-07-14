import { Unit } from "../entities/unit.entity";
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Reservation } from "../entities/reservation.entitiy";
import { HasLock } from "../decorators/has-lock";

@Resolver(Reservation)
class ReservationResolver {
  @Query(() => [Reservation])
  async reservations() {
    return Reservation.find({});
  }

  @Mutation(() => Reservation)
  @HasLock()
  async createReservation(
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
    try {
      const createdReservation = await reservation.save();
      return createdReservation;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @FieldResolver(() => Unit)
  unit(@Root() reservation: Reservation) {
    return Unit.findOneBy({ id: reservation.unit_id });
  }
}
