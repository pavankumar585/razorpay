const { Payment, validate } = require("../models/payment");
const { instance, validatePaymentVerification } = require("../config/razorpay");
const { Product } = require("../models/Product");
const crypto = require("crypto");

let order_id = null;

async function checkout(req, res) {
  try {
    const { error } = validate(req.body);
    //prettier-ignore
    if(error) return res.status(400).json({ status: false, message: error.details[0].message });

    const product = await Product.findById(req.body.productId);
    // prettier-ignore
    if(!product) return res.status(404).json({ status: false, message: "Product not found" });

    const options = {
      amount: product.price * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(options);
    order_id = order.id;
    res.json({ status: true, data: order });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

async function verify(req, res) {
  res.json({ status: true, data: "verify" });
}

module.exports = { checkout, verify };
