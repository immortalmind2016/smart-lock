import { AppDataSource } from "../../../configs/data-source";
import { graphql } from "graphql";
import { graphqlCall } from "../../../test/graphql";
import { Lock } from "../../lock/entities/lock.entity";
import { runSeeder, useSeeding } from "typeorm-seeding";
import LockSeeder from "../../../seeds/lock";

const createReservationMutation = `mutation createReservation($checkOut: Timestamp!, $checkIn: Timestamp!, $guestName: String!, $unitId: Float!){
    createReservation(checkOut: $checkOut, checkIn: $checkIn, guestName: $guestName, unitID: $unitId) {
      id
      guest_name
    }
  }
  `;
describe("test reservation creation", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });
  afterAll(async () => {
    await AppDataSource.destroy();
  });
  it("should pass create reservation", async () => {
    const variableValues = {
      postId: "62c1899123fd53c01a5dc9c5",
      content: "Ahmen mostafa",
      unitName: "test",
      checkOut: 1657818895449,
      checkIn: 1657818895449,
      guestName: "mohamed ahmed",
      unitId: 1,
    };

    const response = await graphqlCall({
      source: createReservationMutation,
      variableValues,
      contextValue: {
        lockData: await Lock.findOneBy({ id: 1 }),
      },
    });
    expect(response.data?.createReservation).toEqual({
      id: expect.any(Number),
      guest_name: variableValues.guestName,
    });
  });
});
