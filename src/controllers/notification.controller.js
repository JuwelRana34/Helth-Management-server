const Notification = require('../models/notification.model');

exports.postNofication = async function (req, res) {
  try {
    const newNotification = await Notification.create(req.body);
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error saving data to database', error });
  }
}

exports.getNotifications = async function (req, res) {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data from database', error });
    }
}

exports.deleteNotification = async function (req, res) {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data from database', error });
    }
}