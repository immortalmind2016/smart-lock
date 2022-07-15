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

import { Context, TempPasswordRequestBody } from "../../../types";
import { generatePassword } from "../utils";
import { generateTempPassword } from "../../../utils/tuya-services";

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
    @Arg("checkOut") check_out: Date,
    @Ctx() context: Context
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
      //create access code on the IOT platform related to this device
      const body: TempPasswordRequestBody = {
        effective_time: check_in,
        invalid_time: check_out,
        name: `reservation-${guest_name}`,
        password: String(generatePassword()),
      };

      const tempPassword = await generateTempPassword(
        String(context.lockData?.id),
        body
      );

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
    @Arg("checkOut") check_out: Date,
    @Ctx() context: Context
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

      const createdReservation = await reservation.save();
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
