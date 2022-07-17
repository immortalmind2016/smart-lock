import { AppDataSource } from "../src/configs/data-source";
import { redisClient } from "../src/utils/redis-client";
import { buildServer } from "../src/server";
import { ApolloServer } from "apollo-server";
import envConfig from "../src/configs/env-config";
import { generateAccessToken } from "../src/modules/token/utils/generate-token";
import { runSeeder, useRefreshDatabase } from "typeorm-seeding";
import UnitLockSeeder from "../src/seeds/unit-lock";
import {
  cancelReservationMutation,
  createReservationMutation,
  updateReservationMutation,
} from "./queries";

jest.setTimeout(1000000);

const { DB_NAME } = envConfig;
let server: ApolloServer;
beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.dropDatabase();

  try {
    await AppDataSource.runMigrations();
  } catch {}
  await runSeeder(UnitLockSeeder);
  await generateAccessToken();

  server = await buildServer();

  await redisClient.connect();
});
afterAll(async () => {
  try {
    await Promise.all([redisClient.quit(), server.stop()]);
  } catch (e) {
    console.log(e);
  }
});

describe("test reservation creation", () => {
  const variableValues = {
    postId: "62c1899123fd53c01a5dc9c5",
    content: "Ahmen mostafa",
    unitName: "test",
    checkOut: 1657818895449,
    checkIn: 1657818895449,
    guestName: "mohamed ahmed",
    unitId: 1,
  };
  const variableValuesUpdate = {
    updateReservationCheckOut2: 1657818895449,
    updateReservationCheckIn2: 1657818895449,
    updateReservationGuestName2: "Mocked Updated 2222222222222222222222",
    updateReservationUnitId2: 1,
    reservationId: 1,
  };
  const variableValuesCancel = {
    id: 1,
  };

  it("should pass create reservation", async () => {
    const { data } = await server.executeOperation({
      query: createReservationMutation,
      variables: variableValues,
    });
    expect(data?.createReservation).toEqual({
      id: expect.any(Number),
      guest_name: variableValues.guestName,
    });
  });

  it("should pass update reservation", async () => {
    const { data } = await server.executeOperation({
      query: updateReservationMutation,
      variables: variableValuesUpdate,
    });

    expect(data?.updateReservation).toEqual({
      id: expect.any(Number),
      guest_name: variableValuesUpdate.updateReservationGuestName2,
    });
  });
  it("should pass cancel reservation", async () => {
    const { data, errors } = await server.executeOperation({
      query: cancelReservationMutation,
      variables: variableValuesCancel,
    });

    expect(data?.cancelReservation).toEqual({
      id: expect.any(Number),
      is_cancelled: true,
    });
  });
});
