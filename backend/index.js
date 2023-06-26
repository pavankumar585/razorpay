const express = require("express");
const app = express();
require("dotenv").config();
require("./config/db")();
const error = require("./middleware/error");
const payments = require("./routes/payments");
const products = require("./routes/products");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", products);
app.use("/api/payments", payments);
app.use(error);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
