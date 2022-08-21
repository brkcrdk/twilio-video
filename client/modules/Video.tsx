import { useRef, useEffect } from 'react';
import { LocalParticipant, Participant } from 'twilio-video';

interface VideoProps {
  participant: LocalParticipant | Participant;
}

function Video({ participant }: VideoProps) {
  const localRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (participant) {
      participant.videoTracks.forEach(({ track }) => {
        if (localRef?.current && track) {
          track.attach(localRef?.current);
        }
      });
    }
  }, [participant]);

  return <video ref={localRef} />;
}
export default Video;
