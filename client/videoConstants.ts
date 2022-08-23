import { CreateLocalTrackOptions } from 'twilio-video';

export const videoContraints: CreateLocalTrackOptions = {
  height: { ideal: 720, min: 480, max: 1080 },
  width: { ideal: 1280, min: 640, max: 1920 },
  aspectRatio: 1.77777777778,
  frameRate: 60,
};
