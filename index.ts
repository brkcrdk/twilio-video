import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import express from 'express';
import twilio from 'twilio';

const app = express();
const port = 5001;

app.use(express.json());

// const AccessToken = require('twilio').jwt.AccessToken;
// const VideoGrant = AccessToken.VideoGrant;
// const express = require('express');

dotenv.config();
// const test = async () => {
//   console.log(process.env.TWILIO_API_KEY_SECRET);
// };

// const twilioClient = require('twilio')(
//   process.env.TWILIO_API_KEY_SID,
//   process.env.TWILIO_API_KEY_SECRET,
//   { accountSid: process.env.TWILIO_ACCOUNT_SID }
// );

const twilioClient = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID
  }
);

// const findOrCreateRoom = async (roomName: string) => {
//   try {
//     await twilioClient.video.rooms(roomName).fetch();
//   } catch (error: any) {
//     // the room was not found, so create it
//     if (error.code === 20404) {
//       await twilioClient.video.rooms.create({
//         uniqueName: roomName,
//         type: 'go'
//       });
//     } else {
//       // let other errors bubble up
//       throw error;
//     }
//   }
// };

// const getAccessToken = (roomName: string) => {
//   // create an access token
//   const AccessToken = twilio.jwt.AccessToken;
//   const VideoGrant = AccessToken.VideoGrant;
//   const token = new AccessToken(
//     String(process.env.TWILIO_ACCOUNT_SID),
//     String(process.env.TWILIO_API_KEY_SID),
//     String(process.env.TWILIO_API_KEY_SECRET),
//     // generate a random unique identity for this participant
//     { identity: uuidv4() }
//   );
//   // // create a video grant for this specific room
//   const videoGrant = new VideoGrant({
//     room: roomName
//   });

//   // // add the video grant
//   token.addGrant(videoGrant);
//   // // serialize the token and return it
//   return token.toJwt();
// };

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
