import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const twilioClient = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID
  }
);

const findOrCreateRoom = async (roomName: string) => {
  try {
    await twilioClient.video.rooms(roomName).fetch();
  } catch (error: any) {
    // the room was not found, so create it
    if (error.code === 20404) {
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: 'go'
      });
    } else {
      // let other errors bubble up
      throw error;
    }
  }
};

export default findOrCreateRoom;
