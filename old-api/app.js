import express from "express";

import {
  getItem,
  getAllProducts,
  getAllProductsOnlyNames,
  quantityLessThan,
  searchItemsByPriceRange,
  updateInventoryItem,
  createInventoryItem,
  searchItemByName,
  getCustomer,
  getAllCustomers,
  getCustomersFromLocation,
  createCustomer,
  updateCustomerInformation,
  findCustomerOrders,
  getOrder,
  placeOrder,
  updateOrderStatus,
  cancelOrder,
  findOrderByStatus,
  deleteInventoryItem,
} from "./database.js";

const app = express();

app.get("/overstacked", async (req, res) => {
  const products = await findOrderByStatus("Pending");
  res.send(products);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
