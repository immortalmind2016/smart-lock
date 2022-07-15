import { Unit } from "../../unit/entities/unit.entity";
import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Reservation } from "../entities/reservation.entity";
import { UseLock } from "../../../decorators/has-lock";
import { Context } from "apollo-server-core";

@Resolver(Reservation)
class ReservationResolver {
  @Query(() => [Reservation])
  async reservations() {
    return Reservation.find({});
  }

  @Mutation(() => Reservation)
  @UseLock()
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
      //logic of creating the access code will be here

      return createdReservation;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  @Mutation(() => Reservation)
  @UseLock()
  async updateReservation(
    @Arg("reservationID", () => ID) id: number,
    @Arg("unitID") unit_id: number,
    @Arg("guestName") guest_name: string,
    @Arg("checkIn") check_in: Date,
    @Arg("checkOut") check_out: Date
  ) {
    try {
      const reservation = await Reservation.findOneBy({ id });
      if (!reservation) {
        throw new Error("NotFound Reservation");
      }

      Object.assign(reservation, {
        unit_id,
        guest_name,
        check_in,
        check_out,
      });

      //logic of delete/re-create the access code will be here

      return reservation.save();
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
