import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// inventory functions (finding)

export async function getItem(id) {
  const [rows] = await pool.query(
    `
      SELECT * 
      FROM inventory 
      WHERE id = ?
      `,
    [id]
  );
  return rows[0];
}

export async function getAllProducts() {
  const [rows] = await pool.query("SELECT * FROM inventory");
  return rows;
}

export async function getAllProductsOnlyNames() {
  const [rows] = await pool.query("SELECT name FROM inventory");
  return rows;
}

export async function quantityLessThan(number) {
  const [rows] = await pool.query(
    `SELECT * 
    FROM inventory 
    WHERE quantity < ?
    `,
    [number]
  );
  return rows;
}

export async function searchItemsByPriceRange(minPrice, maxPrice) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM inventory
    WHERE price BETWEEN ? AND ?
    `,
    [minPrice, maxPrice]
  );
  return rows;
}

// inventroy functions (create / update / delete)

export async function updateInventoryItem(
  id,
  valueBeingUpdated,
  updatedInformation
) {
  const [result] = await pool.query(
    `
    UPDATE inventory 
    SET ${valueBeingUpdated} = ?
    WHERE id = ?
  `,
    [updatedInformation, id]
  );
}

export async function createInventoryItem(
  name,
  price,
  quantity,
  description,
  best_buy_date
) {
  const [result] = await pool.query(
    `
        INSERT INTO inventory (name, price, quantity, description, best_buy_date)
        VALUES (?, ?, ?, ?, ?)
        `,
    [name, price, quantity, description, best_buy_date]
  );
  const inventoryId = result.insertId;
  return getItem(inventoryId);
}

export async function searchItemByName(name) {
  const [rows] = await pool.query(
    `
  SELECT * FROM inventory
  WHERE name = ?`,
    [name]
  );
  return rows.length > 0 ? rows[0].name : "Item not found";
}

// customer functions (get)

export async function getCustomer(id) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM customers
    WHERE id = ?
    `,
    [id]
  );
  return rows[0];
}

export async function getAllCustomers() {
  const [rows] = await pool.query("SELECT * FROM customers");
  return rows;
}

export async function getCustomersFromLocation(street) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM customers
    WHERE address LIKE ?
  `,
    [`%${street}%`]
  );
  return rows;
}

//customer functions (create / update)

export async function createCustomer(first_name, last_name, email, address) {
  const [result] = await pool.query(
    `
  INSERT INTO customers (first_name, last_name, email, address)
  VALUES (?, ?, ?, ?)
  `,
    [first_name, last_name, email, address]
  );
  const customerId = result.insertId;
  return getItem(customerId);
}

export async function updateCustomerInformation(
  id,
  valueBeingUpdated,
  updatedInformation
) {
  const [result] = await pool.query(
    `
    UPDATE customers 
    SET ${valueBeingUpdated} = ?
    WHERE id = ?
  `,
    [updatedInformation, id]
  );
}

export async function deleteInventoryItem(id) {
  const result = await pool.query(
    `DELETE FROM inventory 
    WHERE product_id = ?
    `,
    [id]
  );

  return result.affectedRows > 0
    ? "Item deleted successfully"
    : "Item not found";
}

// order functions (get)

export async function findCustomerOrders(id) {
  const [rows] = await pool.query(
    `SELECT * 
    FROM orders
    WHERE customerid = ?
    `,
    [id]
  );
  return rows;
}

export async function getOrder(id) {
  const [rows] = await pool.query(
    `
      SELECT * 
      FROM orders 
      WHERE id = ?
      `,
    [id]
  );
  return rows[0];
}

// order functions (place)

export async function placeOrder(customer_id, item_id, total_amount) {
  const [result] = await pool.query(
    `
    INSERT INTO orders (customer_id, item_id, total_amount, status)
    VALUES(?, ?, ?, ${"Pending"})
    `,
    [customer_id, item_id, total_amount]
  );
  const orderID = result.insertId;
  return getOrder(orderID);
}

export async function updateOrderStatus(id, status) {
  if (
    status === "Processing" ||
    "Shipped" ||
    "Delivered" ||
    "Canceled" ||
    "Returned"
  ) {
    const [rows] = await pool.query(
      `
      UPDATE orders
      SET ${status} = ?
      WHERE id = ?
      `,
      [status, id]
    );
  }
}

export async function cancelOrder(id) {
  const [rows] = await pool.query(
    `
    DELETE FROM orders
    WHERE order_id = ?
    `[id]
  );
  return result.affectedRows > 0
    ? "Order canceled successfully"
    : "Order not found";
}

export async function findOrderByStatus(status) {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE status = ?
    `,
    [status]
  );
  return rows.map((row) => row.order_id);
}
