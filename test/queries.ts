export const createReservationMutation = `mutation createReservation($checkOut: Timestamp!, $checkIn: Timestamp!, $guestName: String!, $unitId: Float!){
    createReservation(checkOut: $checkOut, checkIn: $checkIn, guestName: $guestName, unitID: $unitId) {
      id
      guest_name
    }
  }
`;
export const updateReservationMutation = `mutation UpdateReservation($updateReservationCheckOut2: Timestamp!, $updateReservationCheckIn2: Timestamp!, $updateReservationGuestName2: String!, $updateReservationUnitId2: Float!, $reservationId: ID!){
    updateReservation(checkOut: $updateReservationCheckOut2, checkIn: $updateReservationCheckIn2, guestName: $updateReservationGuestName2, unitID: $updateReservationUnitId2, reservationID: $reservationId) {
      id
      guest_name
    }
  }
`;

export const cancelReservationMutation = `mutation cancelReservation($id: ID!){
    cancelReservation(reservationID: $id) {
      id
      is_cancelled
    }
  }`;
