import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'twilio-video';
import Video from 'twilio-video';

function Room() {
  const {
    query: { token, roomName },
  } = useRouter();

  useEffect(() => {
    const connectRoom = async () => {
      if (token) {
        const room = await connect(String(token), {
          name: String(roomName),
          video: true,
          audio: false,
        });
        const videoContainer = document.getElementById('video-container');

        const participantDiv = document.createElement('div');
        participantDiv.setAttribute('id', room.localParticipant.identity);
        videoContainer?.appendChild(participantDiv);

        // room.localParticipant.videoTracks.forEach(val => {
        //   // val.track.attach()
        // });
      }
    };
    connectRoom();
  }, []);

  return <div id="video-container">join room with this {token}</div>;
}
export default Room;
