const { Payment, validate } = require("../models/payment");
const { instance, validatePaymentVerification } = require("../config/razorpay");
const { Product } = require("../models/Product");
const crypto = require("crypto");

let razorpay_order_id = null;

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
    razorpay_order_id = order.id;
    res.json({ status: true, data: order });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
}

async function verify(req, res) {
  try {
    const { razorpay_payment_id, razorpay_signature } = req.body;

    const validSignature = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    if (validSignature) {
      const payment = new Payment({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });

      await payment.save();

      razorpay_order_id = null;

      return res.redirect(
        `${process.env.FRONT_END_URL}?payment_id=${razorpay_payment_id}`
      );
    }

    razorpay_order_id = null;
    res.status(400).json({ status: false, message: "Invalid signature" });
  } catch (error) {
    razorpay_order_id = null;
    res.status(500).json({ status: false, message: error.message });
  }
}

module.exports = { checkout, verify };
