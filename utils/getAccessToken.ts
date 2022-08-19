import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';

const getAccessToken = async (roomName: string) => {
  // create an access token
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  const token = new AccessToken(
    String(process.env.TWILIO_ACCOUNT_SID),
    String(process.env.TWILIO_API_KEY_SID),
    String(process.env.TWILIO_API_KEY_SECRET),
    // generate a random unique identity for this participant
    { identity: uuidv4() }
  );
  // // create a video grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName
  });

  // // add the video grant
  token.addGrant(videoGrant);
  // // serialize the token and return it
  return token.toJwt();
};

export default getAccessToken;
