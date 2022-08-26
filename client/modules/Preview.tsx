import { useEffect, useRef, useState } from 'react';
import { isSupported } from 'twilio-video';
import { videoContraints } from 'videoConstants';
import styles from 'styles/Home.module.css';

interface PreviewProps {
  joinRoom: () => void;
  isConnecting: boolean;
  camStatus: boolean;
  onCamStatusChange: () => void;
  audioStatus: boolean;
  onAudioStatusChange: () => void;
}

function Preview({
  joinRoom,
  isConnecting,
  onCamStatusChange,
  camStatus,
  onAudioStatusChange,
  audioStatus,
}: PreviewProps) {
  const [isGettingCam, setIsGettingCam] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getMediaDevices = async () => {
      if (isSupported) {
        try {
          /**
           * NOTE: Eğer twilio-videonun sunduğu createLocalVideo function'ı ile görüntülü oluşturursak
           * Route değiştiği zaman bile bu kamera açık kalıyordu. Bu durumda createLocalVideo'nun oluşturduğu
           * görüntüyü unmount sırasında destroy etmek de pek sağlıklı çalışmıyor. Bu nedenle preview esnasında
           * görüntüyü navite bir şekilde gösteriyoruz.
           */
          const localTrackPreview = await navigator.mediaDevices.getUserMedia({
            video: videoContraints,
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
        } catch (error) {
          setHasPermission(false);
        }
      } else {
        alert('no support of navigator media devices ');
      }
    };
    getMediaDevices();
  }, [camStatus]);

  if (!hasPermission)
    return (
      <div>
        Devam edebilmek için kamera ve mikrofon kullanımı izni tanımlamalısınız!
      </div>
    );

  return (
    <div className={styles.previewContainer}>
      {isGettingCam ? (
        <h1>Loading...</h1>
      ) : (
        <video
          className={styles.initialCam}
          ref={videoRef}
          autoPlay
          playsInline
        />
      )}
      <div className={styles.previewControllers}>
        <div>
          <label>Kamera açık mı katılacaksın?</label>
          <input
            type="checkbox"
            id="camstatus-checkbox"
            checked={camStatus}
            onChange={onCamStatusChange}
          />
        </div>
        <div>
          <label>Mikrofon açık mı katılacaksın?</label>
          <input
            type="checkbox"
            id="audiostatus-checkbox"
            checked={audioStatus}
            onChange={onAudioStatusChange}
          />
        </div>
        <button onClick={joinRoom} disabled={isConnecting}>
          {isConnecting ? 'Joining' : 'Join to room'}
        </button>
      </div>
    </div>
  );
}
export default Preview;
