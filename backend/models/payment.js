const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order_id: String,
  payment_id: String,
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
