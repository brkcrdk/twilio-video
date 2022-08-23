import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { connect, isSupported } from 'twilio-video';
import { useRoom } from 'store';

import { videoContraints } from 'videoConstants';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [isGettingCam, setIsGettingCam] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { push, reload } = useRouter();
  const { dispatch } = useRoom();

  useEffect(() => {
    const getMediaDevices = async () => {
      if (isSupported) {
        /**
         * NOTE: Eğer twilio-videonun sunduğu createLocalVideo function'ı ile görüntülü oluşturursak
         * Route değiştiği zaman bile bu kamera açık kalıyordu. Bu durumda createLocalVideo'nun oluşturduğu
         * görüntüyü unmount sırasında destroy etmek de pek sağlıklı çalışmıyor. Bu nedenle preview esnasında
         * görüntüyü navite bir şekilde gösteriyoruz.
         */
        const localTrackPreview = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoRef?.current) {
          // Preview kamerasını aç/kapa
          if (camOn) {
            videoRef.current.srcObject = localTrackPreview;
          } else {
            videoRef.current.srcObject = null;
          }
        }

        setIsGettingCam(false);
      } else {
        alert('no support of navigator media devices ');
      }
    };
    getMediaDevices();
  }, [camOn]);

  const joinRoom = async () => {
    const roomName = 'dissconnection-test12323';
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
      video: videoContraints,
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
    <div id="container" className={styles.container}>
      {isGettingCam ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <video
            className={styles.initialCam}
            ref={videoRef}
            autoPlay
            playsInline
          />
        </>
      )}
      <>
        <label>Kamera açık mı?</label>
        <input
          type="checkbox"
          checked={camOn}
          onChange={() => setCamOn(p => !p)}
        />
      </>
      <button onClick={joinRoom}>Join To Room</button>
    </div>
  );
};

export default Home;
