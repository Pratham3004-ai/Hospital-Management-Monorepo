import { createServer } from "node:http";
import { exportMonthlyOrders } from "../jobs/exportMonthlyOrders";

createServer(async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end("Method Not Allowed");
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));

  req.on("end", async () => {
    const { shopId, month } = JSON.parse(body);

    const result = await exportMonthlyOrders(shopId, month);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
  });
}).listen(8080, () => {
  console.log("Cloud Run Processor listening on port 8080");
});
