import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { connect, LocalParticipant, Room as RoomType } from 'twilio-video';
import { useRoom } from 'store';

function Room() {
  const { state } = useRoom();

  // const [room, setRoom] = useState<RoomType | null>(null);
  // const localRef = useRef<HTMLVideoElement>(null);
  // const [localParticipant, setLocalParticipant] =
  //   useState<LocalParticipant | null>(null);
  // const {
  //   query: { token, roomName },
  // } = useRouter();

  // useEffect(() => {
  //   const connectRoom = async () => {
  //     if (token && room?.state !== 'connected') {
  //       const roomResponse = await connect(String(token), {
  //         name: String(roomName),
  //         video: true,
  //         audio: false,
  //       });

  //       setRoom(roomResponse);
  //       setLocalParticipant(roomResponse?.localParticipant);
  //     }
  //   };
  //   connectRoom();
  // }, []);

  // useEffect(() => {
  //   if (localParticipant) {
  //     localParticipant.videoTracks.forEach(val => {
  //       if (localRef?.current) {
  //         val.track.attach(localRef?.current);
  //       }
  //     });
  //   }
  //   // if (room) {
  //   //   const videoContainer = document.getElementById('video-container');
  //   //   const participantDiv = document.createElement('div');
  //   //   participantDiv.setAttribute('id', room.localParticipant.identity);
  //   //   videoContainer?.appendChild(participantDiv);

  //   // }
  // }, [localParticipant]);

  // useEffect(() => {
  //   return () => {
  //     if (room) {
  //       // room.localParticipant.videoTracks.forEach(track => track.unpublish());
  //       room.disconnect();
  //       // room.on('participantDisconnected', (participant: Participant) => {
  //       //   participant.removeAllListeners();
  //       //   const participantDiv = document.getElementById(participant.identity);
  //       //   participantDiv?.remove();
  //       // });
  //     }
  //   };
  // }, [room]);

  return (
    <div id="video-container">
      {/* join room with this {token} */}
      {/* {localParticipant && <video ref={localRef} autoPlay muted playsInline />} */}
      {JSON.stringify(state.room, null, 4)}
    </div>
  );
}
export default Room;
