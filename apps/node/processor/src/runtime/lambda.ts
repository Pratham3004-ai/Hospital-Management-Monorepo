import { exportMonthlyOrders } from "../jobs/exportMonthlyOrders";

export async function handler(event: any) {
  const { shopId, month } = JSON.parse(event.body || "{}");

  const result = await exportMonthlyOrders(shopId, month);

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
}
