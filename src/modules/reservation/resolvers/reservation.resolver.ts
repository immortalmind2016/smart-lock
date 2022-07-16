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
import { redisClient } from "../../../utils/redis-client";
import { reservationService } from "../reservation.service";

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
    try {
      return reservationService.create({
        unit_id,
        guest_name,
        check_in,
        check_out,
        remote_lock_id: context.lockData?.remote_lock_id || "",
      });
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
