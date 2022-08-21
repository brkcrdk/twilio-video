import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const getAccessToken = async (roomName: string) => {
  // twilio hesap bilgilerimiz ile bir oda oluşturmak içn
  // token üretiyoruz.
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  const identity = uuidv4();
  console.log('try with this identity', identity);
  const token = new AccessToken(
    String(process.env.TWILIO_ACCOUNT_SID),
    String(process.env.TWILIO_API_KEY_SID),
    String(process.env.TWILIO_API_KEY_SECRET),
    // bu talepte bulunan kişinin bilgilerinin bulunacağı bir uniq keyi ifade eder
    // identitye istediğimizi vereblir. Bu sonradan sistemimizde bulunan kişiye ait
    // bir token de olabilir.
    { identity }
  );
  // bu odaya ulaşım için yetki tanımlamasını yapıyoruz
  const videoGrant = new VideoGrant({
    room: roomName
  });

  // Bu tokena ait kişiye video yetkisi vermiş oluyoruz
  token.addGrant(videoGrant);
  // ardından oluşan bu token'ı jwt formatta return ediyoruz
  return token.toJwt();
};

export default getAccessToken;
