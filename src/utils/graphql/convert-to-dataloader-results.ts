export function convertToDataloaderResult(
  requestedIds: any[],
  returnedItems,
  key = "id"
) {
  return requestedIds.map((id) => ({
    [String(id)]:
      returnedItems.find((reservation) => reservation[key] == id) || null,
  }));
}
