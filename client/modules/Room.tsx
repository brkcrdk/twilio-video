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
        room.localParticipant.tracks.forEach(track => {
          // const test = new MediaStream(track.track.);
          // return track.attach();
          // return console.log(track);
        });
      }
    };
    connectRoom();
  }, []);

  return <div id="video-container">join room with this {token}</div>;
}
export default Room;
