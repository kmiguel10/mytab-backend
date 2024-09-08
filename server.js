require("dotenv").config({ path: "./.env" });

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

const verifyReceipt = async (receiptData, isSandbox) => {
  const url = isSandbox
    ? "https://sandbox.itunes.apple.com/verifyReceipt"
    : "https://buy.itunes.apple.com/verifyReceipt";

  const response = await axios.post(url, {
    "receipt-data": receiptData,
    password: "shared_secret", // Your App Store Connect shared secret
  });

  return response.data;
};

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/", (req, res) => {
  console.log("Hello");
  res.send("Hello"); // Respond to the client
});

app.post("/verify-receipt", async (req, res) => {
  const { receiptData, isSandbox } = req.body;

  try {
    const verificationResult = await verifyReceipt(receiptData, isSandbox);

    if (verificationResult.status === 0) {
      res.status(200).send(verificationResult);
    } else {
      res.status(400).send({ error: "Invalid receipt" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: "Verification failed,", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
