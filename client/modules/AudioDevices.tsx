import { useEffect, useState } from 'react';
function AudioDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [output, setOutput] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = async () => {
      const device = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = device.filter(dev => dev.kind === 'audioinput');
      const outputDevices = device.filter(dev => dev.kind === 'audiooutput');
      setOutput(outputDevices);
      setDevices(audioDevices);
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

      {!!output?.length && (
        <select>
          {output.map(dev => (
            <option key={dev.deviceId} value={dev.deviceId}>
              {dev.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
export default AudioDevices;
