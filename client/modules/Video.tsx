import { forwardRef } from 'react';
import { Participant } from 'twilio-video';
import styles from 'styles/Home.module.css';

interface VideoProps {
  participant: Participant;
  hasVideo?: boolean;
  hasAudio?: boolean;
  isLoading?: boolean;
  isLocal?: boolean;
  onKickRemoteParticipant?: (participant: Participant) => void;
  onMuteRemoteParticipant?: (participant: Participant) => void;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      participant,
      hasVideo = true,
      hasAudio = true,
      isLoading,
      isLocal,
      onKickRemoteParticipant,
      onMuteRemoteParticipant,
    },
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
          {!isLocal && (
            <div>
              <button
                onClick={() => {
                  if (onMuteRemoteParticipant) {
                    onMuteRemoteParticipant(participant);
                  }
                }}
              >
                Mute
              </button>
              <button
                onClick={() => {
                  if (onKickRemoteParticipant) {
                    onKickRemoteParticipant(participant);
                  }
                }}
              >
                Odadan Çıkar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Video;
