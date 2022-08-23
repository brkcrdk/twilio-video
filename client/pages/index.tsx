import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { connect, createLocalVideoTrack, isSupported } from 'twilio-video';
import { useRoom } from 'store';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [isGettingCam, setIsGettingCam] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { push } = useRouter();
  const { dispatch } = useRoom();

  useEffect(() => {
    const getMediaDevices = async () => {
      if (isSupported) {
        const localTrackPreview = await createLocalVideoTrack();
        if (videoRef?.current) {
          localTrackPreview.attach(videoRef.current);
        }
        setIsGettingCam(false);
      } else {
        alert('no support of navigator media devices ');
      }
    };
    getMediaDevices();
  }, []);

  const joinRoom = async () => {
    const roomName = 'dissconnection-test123';
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
      video: true,
      audio: false,
    });

    dispatch({
      type: 'SET_ROOM',
      payload: {
        room,
      },
    });

    push('/room');
  };

  return (
    <div className={styles.container}>
      {isGettingCam ? (
        <h1>Loading...</h1>
      ) : (
        <video
          className={styles.initialCam}
          ref={videoRef}
          muted
          autoPlay
          playsInline
        />
      )}
      <button onClick={joinRoom}>Join To Room</button>
    </div>
  );
};

export default Home;
