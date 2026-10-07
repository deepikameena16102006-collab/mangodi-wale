import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Order from "./Order.js";
dotenv.config();
const app = express();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) => console.error("MongoDB Connection Error:", error));
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

const products = [
  {
    id: 1,
    name: "Mangodi",
    description: "Traditional Rajasthani taste.",
    prices: {
      "250g": 70,
      "500g": 130,
      "1kg": 240,
    },
  },
  {
    id: 2,
    name: "Banana Chips",
    description: "Light, crispy and crunchy.",
    prices: {
      "250g": 110,
      "500g": 210,
      "1kg": 390,
    },
  },
  {
    id: 3,
    name: "Namkeen",
    description: "Perfect tea-time snack.",
    prices: {
      "250g": 70,
      "500g": 130,
      "1kg": 240,
    },
  },
];
const orders = [];
app.get("/", (req, res) => {
  res.send("Mangodi Wale Backend is Running!");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});
app.post("/api/orders", async (req, res) => {
  try {
    if (!req.body.orderId || !req.body.customer || !req.body.items || !req.body.total) {
  return res.status(400).json({
    success: false,
    message: "Invalid order data",
  });
}
    const order = new Order(req.body);

    const savedOrder = await order.save();

    res.json({
      success: true,
      message: "Order saved to MongoDB successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("MongoDB Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Order could not be saved.",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});