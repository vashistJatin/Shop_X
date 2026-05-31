const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:     String,
  image:    String,
  price:    Number,
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:           [orderItemSchema],
  totalAmount:     { type: Number, required: true },
  status:          { type: String, enum: ["pending","processing","shipped","delivered","cancelled"], default: "pending" },
  paymentStatus:   { type: String, enum: ["pending","paid","failed"], default: "pending" },
  stripeSessionId: { type: String, default: "" },
  address: {
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
