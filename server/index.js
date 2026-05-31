const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Stripe webhook needs raw body — mount BEFORE json parser
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders",   require("./routes/orders"));
app.use("/api/admin",    require("./routes/admin"));
app.use("/api/payment",  require("./routes/payment"));

app.get("/", (req, res) => res.json({ message: "ShopX API running" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
