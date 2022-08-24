import { useState } from 'react';
import type { NextPage } from 'next';
import { connect } from 'twilio-video';
import { useRoom } from 'store';
import { Room, Disconnected, Preview } from 'modules';

import { videoContraints } from 'videoConstants';
import styles from 'styles/Home.module.css';

const Home: NextPage = () => {
  const [camOn, setCamOn] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const {
    state: { room, disconnected },
    dispatch,
  } = useRoom();

  const joinRoom = async () => {
    setConnecting(true);
    const roomName = 'testing-room';
    const request = await fetch('http://localhost:4000/join-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName,
      }),
    });
    const { token }: { token: string } = await request.json();

    const room = await connect(String(token), {
      name: String(roomName),
      video: camOn ? videoContraints : false,
      audio: false,
    });

    dispatch({
      type: 'SET_ROOM',
      payload: {
        room,
      },
    });
    setConnecting(false);
  };

  return (
    <div id="container" className={styles.container}>
      {room && <Room />}
      {disconnected && <Disconnected />}
      {!room && !disconnected && (
        <Preview
          isConnecting={connecting}
          onCamStatusChange={() => setCamOn(p => !p)}
          camStatus={camOn}
          joinRoom={joinRoom}
        />
      )}
    </div>
  );
};

export default Home;
