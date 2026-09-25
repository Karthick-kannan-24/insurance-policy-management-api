import { Message } from "../models/Message.js";

export const scheduleMessage = async (req, res, next) => {
  try {
    const { message, day, time } = req.body || {};

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!day) {
      return res.status(400).json({
        success: false,
        message: "Day is required",
      });
    }

    if (!time) {
      return res.status(400).json({
        success: false,
        message: "Time is required",
      });
    }

    const scheduledAt = new Date(`${day}T${time}:00`);

    if (Number.isNaN(scheduledAt.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid day or time format",
      });
    }

    if (scheduledAt <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled time must be in the future",
      });
    }

    const scheduledMessage = await Message.create({
      message: message.trim(),
      scheduledAt,
      status: "scheduled",
    });

    return res.status(201).json({
      success: true,
      message: "Message scheduled successfully",
      data: {
        id: scheduledMessage._id,
        message: scheduledMessage.message,
        scheduledAt: scheduledMessage.scheduledAt,
        status: scheduledMessage.status,
      },
    });
  } catch (error) {
    next(error);
  }
};