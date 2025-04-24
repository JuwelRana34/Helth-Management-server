const Contacts = require("../models/contact.model")

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
        const { id } = req.params;
        await Contacts.findByIdAndDelete(id);
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: "Failed to delete contact", error });
    }
}