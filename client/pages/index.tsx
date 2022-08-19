import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getMediaDevices = async () => {
      const streams = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setMyStream(streams);
      if (videoRef?.current) {
        videoRef.current.srcObject = streams;
      }
    };
    getMediaDevices();
  }, []);

  return (
    <div className={styles.container}>
      {myStream && <video ref={videoRef} muted autoPlay playsInline />}
    </div>
  );
};

export default Home;
