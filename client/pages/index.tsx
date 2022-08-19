import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [isGettingCam, setIsGettingCam] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { push } = useRouter();

  useEffect(() => {
    const getMediaDevices = async () => {
      const streams = await navigator.mediaDevices.getUserMedia({
        video: { aspectRatio: 16 / 9, frameRate: 60 },
      });
      setMyStream(streams);
      if (videoRef?.current) {
        videoRef.current.srcObject = streams;
      }
      setIsGettingCam(false);
    };
    getMediaDevices();
  }, []);

  const joinRoom = async () => {
    // join room'a katılma isteği atılır
    // katılma isteğinden dönen token bir yerde saklanır o tokenla birlikte odaya girilir

    const request = await fetch('http://localhost:4000/join-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: 'denemeOdası',
      }),
    });
    const response = await request.json();

    console.log(response);
  };

  return (
    <div className={styles.container}>
      {isGettingCam ? (
        'loading...'
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
