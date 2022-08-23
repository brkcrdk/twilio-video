import { forwardRef } from 'react';
import { Participant } from 'twilio-video';

interface VideoProps {
  participant: Participant;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ participant }, ref) => {
    return (
      <>
        <video ref={ref} autoPlay playsInline />
        <span>{participant.identity}</span>
      </>
    );
  }
);

export default Video;
