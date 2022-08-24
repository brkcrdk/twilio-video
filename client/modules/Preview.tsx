import { useEffect, useRef, useState } from 'react';
import { isSupported } from 'twilio-video';

import styles from 'styles/Home.module.css';

interface PreviewProps {
  joinRoom: () => void;
  isConnecting: boolean;
  onCamStatusChange: () => void;
  camStatus: boolean;
}

function Preview({
  joinRoom,
  isConnecting,
  onCamStatusChange,
  camStatus,
}: PreviewProps) {
  const [isGettingCam, setIsGettingCam] = useState(true);
  // const [camOn, setCamOn] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

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
          if (camStatus) {
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
  }, [camStatus]);

  return (
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
          checked={camStatus}
          onChange={onCamStatusChange}
        />
      </>
      <button onClick={joinRoom} disabled={isConnecting}>
        {isConnecting ? 'Joining' : 'Join to room'}
      </button>
    </>
  );
}
export default Preview;
