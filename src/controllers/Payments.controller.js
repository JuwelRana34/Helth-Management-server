const Payment = require("../models/payments.model");
const User = require("../models/user.model");
const axios = require("axios");
const { v4:uuidv4 } = require("uuid");

exports.postPayment = async function (req, res) {
  try {
    const { cus_name, cus_email, cus_phone, userID ,amount,fail_url,cancel_url } = req.body;
    const tran_id = "TXN_" + uuidv4().replace(/-/g, "").substring(0, 12);
    const paymentData = {
      store_id: process.env.Store_id,
      signature_key: process.env.Signature_key,
      cus_name,
      cus_email,
      cus_phone,
      amount:100, //need to verify with mongodb
      currency: "BDT",
      tran_id: tran_id,
      desc: "test transaction",
      success_url: `${process.env.backend_url}/api/payment-success`,
      fail_url,
      cancel_url,
      type: "json",
    };

    await Payment.create({
      tran_id: tran_id,
      amount: amount,
      paymentStatus: "pending",
      request_id: tran_id,
      userId:userID
    });
    // Ensure amount verification from DB (You should do this before processing)

    const { data } = await axios.post(
      "https://sandbox.aamarpay.com/jsonpost.php",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("initail payment", data);
    res.status(200).json({ payment_url: data.payment_url });
  } catch (error) {
    console.error(
      "Payment Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Payment processing failed" });
  }
};

exports.getPaymentSuccess = async function (req, res) {
  try {
    const responseData = req.body;
    const { mer_txnid, pay_status, card_type } = responseData;

    if (pay_status !== "Successful")
      return res.status(400).json({ error: "Transaction ID is required" });

    const url = `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${mer_txnid}&store_id=${process.env.Store_id}&signature_key=${process.env.Signature_key}&type=json`;

    const { data } = await axios.get(url);

   
    if (data?.pay_status === "Successful") {
      await Payment.updateOne({ tran_id: mer_txnid }, { paymentMethod: card_type
        });
        return res.redirect(`${process.env.frontend_redirectURl}/paymentSuccess?tran_id=${mer_txnid}`);
    } else {
        return res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error(
      "Payment Success Error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to process payment success" });
  }
};

exports.verifyPayment = async function (req, res) {
  try {
    const { tran_id, userID } = req.params;
    if (!tran_id )
      return res.status(400).json({ error: "Transaction ID is required" });

    const url = `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${tran_id}&store_id=${process.env.Store_id}&signature_key=${process.env.Signature_key}&type=json`;

    const { data } = await axios.get(url);

    if (data?.pay_status === "Successful") {
       await Payment.updateOne({ tran_id }, { paymentStatus: "paid"
        });
      await User.findByIdAndUpdate(
          userID,
          { subscriptions: new Date(new Date().setDate(new Date().getDate()+ 2))},
          { new: true, runValidators: true } 
        );
        const paddingPayments = await Payment.find({userId: userID})

        if(paddingPayments.length > 0){
           await Payment.deleteMany({ userId:userID, paymentStatus: "pending" });
        }
      // Send email  user about successful payment {pending implementation}

      return res.status(200).json({ status:true, message: "payment verified " });
    }
  } catch (err) {
    console.error(
      "Payment Verification Error:",
      err.response ? err.response.data : err.message
    );
    res.status(500).json({ error: "Failed to payment verification" });
  }
};

exports.payments = async function (req, res) {
  const {userid}= req.params
  try {
    const payments = await Payment.find({userId:userid}).populate("userId");
    return res.status(200).json(payments);
  } catch (error) {
    console.error("Payment Fetch Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
};

