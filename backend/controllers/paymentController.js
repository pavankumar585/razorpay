const Payment = require("../models/payment");
const { instance, validatePaymentVerification } = require("../config/razorpay");

async function checkout(req, res) {
  res.json({ status: true, data: "checkout" });
}

async function verify(req, res) {
  res.json({ status: true, data: "verify" });
}

module.exports = { checkout, verify };
