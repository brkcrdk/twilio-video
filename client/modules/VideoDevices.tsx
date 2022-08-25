import { useEffect, useState } from 'react';

function VideoDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      const device = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = device.filter(dev => dev.kind === 'videoinput');
      setDevices(videoDevices);
    };
    getDevices();
  }, []);

  return (
    <div>
      <select>
        {devices.map(dev => (
          <option key={dev.deviceId} value={dev.deviceId}>
            {dev.label}
          </option>
        ))}
      </select>
    </div>
  );
}
export default VideoDevices;
