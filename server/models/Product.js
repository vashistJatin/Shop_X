const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name:    String,
  rating:  { type: Number, required: true },
  comment: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, default: 0 },
  image:       { type: String, required: true },
  category:    { type: String, required: true },
  brand:       { type: String, default: "" },
  stock:       { type: Number, required: true, default: 0 },
  rating:      { type: Number, default: 0 },
  numReviews:  { type: Number, default: 0 },
  reviews:     [reviewSchema],
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
