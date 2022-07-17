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

import { Context } from "../../../types";
import { reservationService } from "../reservation.service";

@Resolver(Reservation)
class ReservationResolver {
  @Query(() => [Reservation])
  async reservations() {
    return reservationService.list();
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
    } catch (e: any) {
      console.error(e);
      throw new Error(`cannot create reservation ${e.message}`);
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
      return reservationService.update(id, {
        unit_id,
        guest_name,
        check_in,
        check_out,
        remote_lock_id: context.lockData?.remote_lock_id || "",
      });
    } catch (e: any) {
      console.error(e);
      throw new Error(`cannot update reservation ${e.message}`);
    }
  }
  @Mutation(() => Reservation)
  @UseLock()
  async cancelReservation(
    @Arg("reservationID", () => ID) id: number,
    @Ctx() context: Context
  ) {
    try {
      return reservationService.cancel(
        id,
        context.lockData?.remote_lock_id as string
      );
    } catch (e: any) {
      console.error(e);
      throw new Error(`cannot update reservation ${e.message}`);
    }
  }

  @FieldResolver(() => Unit)
  unit(@Root() reservation: Reservation) {
    return Unit.findOneBy({ id: reservation.unit_id });
  }
}
