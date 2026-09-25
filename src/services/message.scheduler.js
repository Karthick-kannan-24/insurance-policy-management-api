import cron from "node-cron";
import { Message } from "../models/Message.js";

export const startMessageScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const messages = await Message.find({
        status: "scheduled",
        scheduledAt: {
          $lte: now,
        },
      });

      for (const message of messages) {
        message.status = "sent";
        message.processedAt = new Date();

        await message.save();

        console.log(
          `Scheduled message processed: ${message.message}`
        );
      }
    } catch (error) {
      console.error(
        "Message scheduler error:",
        error.message
      );
    }
  });

  console.log("Message scheduler started");
};