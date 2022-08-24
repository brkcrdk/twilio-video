import { forwardRef } from 'react';
import { Participant } from 'twilio-video';
import styles from 'styles/Home.module.css';

interface VideoProps {
  participant: Participant;
  hasVideo?: boolean;
  hasAudio?: boolean;
  isLoading?: boolean;
  isLocal?: boolean;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (
    { participant, hasVideo = true, isLoading, isLocal, hasAudio = true },
    ref
  ) => {
    return (
      <div className={styles.videoContainer}>
        <video
          className={styles.videoElement}
          style={{
            display: hasVideo ? 'flex' : 'none',
          }}
          ref={ref}
          autoPlay
          playsInline
        />
        {!hasVideo && (
          <div className={styles.avatarContainer}>
            {isLoading ? 'Kamera Açılıyor' : 'Kamera yok'}
          </div>
        )}
        <div className={styles.videoInfo}>
          <span>Participant ID:{participant.identity}</span>
          <span>Statu: {isLocal ? 'Local' : 'Remote'}</span>
          <span>Kamera:{hasVideo ? 'Açık' : 'Kapalı'}</span>
          <span>Mikrofon:{hasAudio ? 'Açık' : 'Kapalı'}</span>
        </div>
      </div>
    );
  }
);

export default Video;
