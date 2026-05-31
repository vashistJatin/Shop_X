const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/Order");
const protect = require("../middleware/auth");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items provided" });

    // Build line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // paise
      },
      quantity: item.quantity,
    }));

    // Create pending order first
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount: items.reduce((s, i) => s + i.price * i.quantity, 0),
      address,
      paymentStatus: "pending",
      status: "pending",
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/orders?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart?cancelled=true`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// Stripe webhook — update order after payment
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { orderId } = session.metadata;
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      status: "processing",
      stripeSessionId: session.id,
    });
  }

  res.json({ received: true });
});

// Verify session after redirect
router.get("/verify-session/:sessionId", protect, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    if (session.payment_status === "paid") {
      const order = await Order.findById(session.metadata.orderId);
      await Order.findByIdAndUpdate(session.metadata.orderId, {
        paymentStatus: "paid",
        status: "processing",
      });
      res.json({ success: true, order });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
