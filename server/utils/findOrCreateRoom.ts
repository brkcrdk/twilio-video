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
    // Eğer verilen oda ismiyle bir oda oluşturulmuşsa o odaya bağlanmak için izin alır
    await twilioClient.video.rooms(roomName).fetch();
    // Hata durumunda unkown geliyor ve demo ürettiğim için typescriptte hata
    // sebeplerini daraltıp ona göre önlem almak gerekiyor. Buna daha sonra odaklanmayı
    // Doğru buluyorum.
  } catch (error: any) {
    // Oda bulunamazsa verilen oda adıyla bir oda oluşturur
    if (error.code === 20404) {
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: 'peer-to-peer'
      });
    } else {
      // Eğer daha farklı bir hata oluşursa, hata verir
      throw error;
    }
  }
};

export default findOrCreateRoom;
