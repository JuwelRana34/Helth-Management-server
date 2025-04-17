const Payment = require("../models/payments.model");
const User = require("../models/user.model");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const sendConfirmationEmail = require("../utils/sendEmail");


exports.postPayment = async function (req, res) {
  try {
    const {
      plan,
      cus_name,
      cus_email,
      cus_phone,
      userID,
      fail_url,
      cancel_url,
    } = req.body;
    let amount = 0;

    if (plan === "basic") {
      amount = 7000;
    } else if (plan === "premium") {
      amount = 30000;
    } else if (plan === "family") {
      amount = 120000;
    } else {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const tran_id = "TXN_" + uuidv4().replace(/-/g, "").substring(0, 12);
    const paymentData = {
      store_id: process.env.Store_id,
      signature_key: process.env.Signature_key,
      cus_name,
      cus_email,
      cus_phone,
      amount, 
      currency: "BDT",
      tran_id,
      desc: "test transaction",
      success_url: `${process.env.backend_url}/api/payment-success`,
      fail_url,
      cancel_url,
      type: "json",
    };

    await Payment.create({
      tran_id,
      plan,
      amount,
      paymentStatus: "pending",
      request_id: tran_id,
      userId: userID,
    });

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
      return res.status(400).json({ error: " payment not successful" });

    const url = `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${mer_txnid}&store_id=${process.env.Store_id}&signature_key=${process.env.Signature_key}&type=json`;

    const { data } = await axios.get(url);

    if (data?.pay_status === "Successful") {
      await Payment.updateOne(
        { tran_id: mer_txnid },
        { paymentMethod: card_type }
      );
      return res.redirect(
        `${process.env.frontend_redirectURl}/paymentSuccess?tran_id=${mer_txnid}`
      );
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
    if (!tran_id)
      return res.status(400).json({ error: "Transaction ID is required" });

    const url = `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${tran_id}&store_id=${process.env.Store_id}&signature_key=${process.env.Signature_key}&type=json`;

    //  verifyPayment 
    const { data } = await axios.get(url);

    if (data?.pay_status === "Successful") {
      const paymentRecord = await Payment.findOne({ tran_id });
      if (!paymentRecord) {
        return res.status(404).json({ error: "Payment record not found" });
      }
      const planDetails = {
        basic: { validity:0, ticket:10, plan: "basic" },
        premium: { validity:365, ticket: 0, plan: "premium" },
        family: { validity: 365, ticket: 0, plan: "family" },
      };
      const { validity, ticket, plan } = planDetails[paymentRecord.plan];

      await Payment.updateOne({ tran_id }, { paymentStatus: "paid" });

      //  check subscribetion validity 
      const user = await User.findById(userID);
      let newSubscriptionEndDate;

      if (user.subscriptions && new Date(user.subscriptions) > Date.now()) {
        newSubscriptionEndDate = new Date(user.subscriptions.getTime() + validity * 24 * 60 * 60 * 1000);
      } else { 
        newSubscriptionEndDate = new Date(Date.now() + validity * 24 * 60 * 60 * 1000);
      }

      const userUpdateResult = await User.findByIdAndUpdate(
        userID,
        {
          subscriptions: newSubscriptionEndDate,
          $inc: { ticket },
          subscriptionPlan: plan,
        },
        { new: true, runValidators: true }
      );

      if (!userUpdateResult) {
        return res
          .status(500)
          .json({ error: "Failed to update user subscription" });
      }

      const paddingPayments = await Payment.find({ userId: userID });

      if (paddingPayments.length > 0) {
        await Payment.deleteMany({ userId: userID, paymentStatus: "pending" });
      }

      const userInfo = await User.findById(userID);
      
      const ticketHtml = userInfo.subscriptionPlan === "basic" 
  ? `<p style="font-size: 16px; color: #333333;"><strong>Ticket(s):</strong> ${ticket}</p>`
  : `<p style="font-size: 16px; color: #333333;"><strong>Validity Till:</strong> ${userInfo.subscriptions} days</p>`;

      const mailOptions = {
        from: '"Health Care" <rk370613@gmail.com>',
        to: userInfo.email,
        subject: "🧾 Payment Confirmation  Health Care",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f8;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    
    <!-- Header -->
    <div style="background-color: #00796b; padding: 20px; text-align: center;">
      <img src="https://cdn-icons-png.flaticon.com/128/4326/4326328.png" alt="Health Care" style="height: 50px;" />
      <h2 style="color: #ffffff; margin-top: 10px;">Payment Confirmation</h2>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333333;">Dear ${
        userInfo.name || "Customer"
      },</p>
      <p style="font-size: 16px; color: #333333;">
        Thank you for your payment. We have successfully received your payment and your transaction has been confirmed.
      </p>

      <hr style="margin: 20px 0;" />

      <p style="font-size: 16px; color: #333333;"><strong>Transaction ID:</strong> ${
        paymentRecord.tran_id
      }</p>
      <p style="font-size: 16px; color: #333333;"><strong>Amount Paid:</strong> ${
        paymentRecord.amount
      } BDT</p>
      <p style="font-size: 16px; color: #333333;"><strong>Plan:</strong>${plan}</p>
      ${ ticketHtml}
      <hr style="margin: 20px 0;" />

      <p style="font-size: 14px; color: #666666;">
        If you have any questions, feel free to contact our support team.
      </p>
      <p style="font-size: 14px; color: #666666;">
        Thank you for choosing <strong>Health Care</strong>.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 13px; color: #999;">
      © ${new Date().getFullYear()} Health Care. All rights reserved.
    </div>
  </div>
</div> `,
      };
       
      // confirMation Email Send
      await sendConfirmationEmail(mailOptions);

      return res
        .status(200)
        .json({ status: true, message: "payment verified " });
    }
  } catch (err) {
    console.error(
      "Payment Verification Error:",
      err.response ? err.response.data : err.message
    );
    res.status(500).json({ error: err });
  }
};

exports.payments = async function (req, res) {
  const { userid } = req.params;
   const user = await User.findById(userid)
   if(user.email !== req.user.email){
    return res.status(404).json({message:" unauthorize access"})
   }
  try {
    const payments = await Payment.find({ userId: userid }).populate("userId");
    return res.status(200).json(payments);
  } catch (error) {
    console.error("Payment Fetch Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
};
exports.Allpayments = async function (req, res) {

  //  if(user.email !== req.user.email){
  //   return res.status(404).json({message:" unauthorize access"})
  //  }
  try {
    const payments = await Payment.aggregate([
     { $match: {
        paymentStatus: "paid"
      }
    },
    {
      $addFields: {
        userIdObj: { $toObjectId: "$userId" } // Convert string to ObjectId
      }
    },
      {
        $lookup: {
          from: "users",            // Name of the users collection
          localField: "userIdObj",     // Field in the transactions collection
          foreignField: "_id",      // Field in the users collection
          as: "userInfo"            // Alias for the joined user data
        }
      },
      {
        $unwind: "$userInfo"        // Converts array to object (if you want individual user objects)
      },
      {
        $project: {
          _id: 1,
          tran_id: 1,
          amount: 1,
          paymentStatus: 1,
          paymentMethod: 1,
          createdAt: 1,
          "userInfo.name": 1,
          "userInfo.email": 1,
          "userInfo.role": 1
          // Include any other user fields you want
        }
      }

    ])
    return res.status(200).json(payments);
  } catch (error) {
    console.error("Payment Fetch Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
};
