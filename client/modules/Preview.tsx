import { useEffect, useRef, useState } from 'react';
import { connect, isSupported } from 'twilio-video';

import { useRoom } from 'store';
import styles from 'styles/Home.module.css';

interface PreviewProps {
  joinRoom: () => void;
}

function Preview({ joinRoom }: PreviewProps) {
  const [isGettingCam, setIsGettingCam] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    state: { room, disconnected },
  } = useRoom();

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

  return (
    !room &&
    !disconnected && (
      <>
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
      </>
    )
  );
}
export default Preview;
