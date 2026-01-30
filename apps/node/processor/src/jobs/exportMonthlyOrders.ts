export async function exportMonthlyOrders(shopId: string, month: string) {
  // Pure logic only.
  // No AWS imports. No DB driver here.

  return {
    success: true,
    blobKey: `exports/${shopId}/${month}.sqlite`
  };
}
