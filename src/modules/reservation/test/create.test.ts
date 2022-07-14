import { graphql } from "graphql";
import { graphqlCall } from "../../../test/graphql";

const createReservationMutation = `mutation createReservation($checkOut: Timestamp!, $checkIn: Timestamp!, $guestName: String!, $unitId: Float!){
    createReservation(checkOut: $checkOut, checkIn: $checkIn, guestName: $guestName, unitID: $unitId) {
      id
      guest_name
    }
  }
  `;
describe("test reservation creation", () => {
  it("should pass create reservation", async () => {
    console.log(
      await graphqlCall({
        source: createReservationMutation,
        variableValues: {
          postId: "62c1899123fd53c01a5dc9c5",
          content: "Ahmen mostafa",
          unitName: "test",
          checkOut: 1657818895449,
          checkIn: 1657818895449,
          guestName: "mohamed ahmed",
          unitId: 1,
        },
      })
    );
  });
});
