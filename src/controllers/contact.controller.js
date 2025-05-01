const Contacts = require("../models/contact.model")
const sendConfirmationEmail = require("../utils/sendEmail");
exports.Contact = async (req, res) => {
    const { name, email, message } = req.body
    try {
        await Contacts.create({
            name,
            email,
            message
        })
        res.status(200).json({ message: "successfully message sent" })
    } catch (error) {
        res.status(404).json({ message: "message sent failed" })
    }
}
exports.GetContact = async (req, res) => {
    try {
        const response = await Contacts.find()
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({ message: "messages not found something is wrong please try again." })
    }
}

exports.DeleteContact = async (req, res) => {
  try {
    const { reply, email } = req.body;
    const { id } = req.params;
    if (!id || !reply || !email) {
      return res.status(400).json({ message: "somthing wrong send reply." });
    }

    const mailOptions = {
      from: '"Health Care" <rk370613@gmail.com>',
      to: email,
      subject: "🧾your enquiry reply from Health Care.",
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
          ${reply}
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

    await Contacts.findByIdAndDelete(id);
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Failed to delete contact", error });
  }
};