import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { connect } from 'twilio-video';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [isGettingCam, setIsGettingCam] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { push } = useRouter();

  useEffect(() => {
    const getMediaDevices = async () => {
      if (navigator?.mediaDevices?.getUserMedia) {
        const streams = await navigator.mediaDevices.getUserMedia({
          video: { aspectRatio: 16 / 9, frameRate: 60 },
        });
        setMyStream(streams);
        if (videoRef?.current) {
          videoRef.current.srcObject = streams;
        }
        setIsGettingCam(false);
      } else {
        alert('no support of navigator mediadevices ');
      }
    };
    getMediaDevices();
  }, []);

  const joinRoom = async () => {
    const roomName = 'newest-room';
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
    // currently we will transfer token to room with query.
    // push(`/room?token=${token}&roomName=${roomName}`);

    const room = await connect(String(token), {
      name: String(roomName),
      video: true,
      audio: false,
    });
    console.log(
      'connected to the room, now redirect to room page',
      room.localParticipant.identity
    );
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
