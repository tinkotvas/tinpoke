import { useState, useRef, useCallback, useEffect } from 'react';
import { useSwitchStore } from '../stores/switchStore.js';

// States: idle → detecting → prompting → streaming → error | stopped
// Standard resolutions to offer, in descending order
const CANDIDATE_RESOLUTIONS = [
  { w: 1920, h: 1080 },
  { w: 1280, h: 720 },
  { w: 960, h: 540 },
  { w: 640, h: 480 },
];

const hasId = d => d.deviceId && d.deviceId !== '';

async function enumerateUsableDevices() {
  let devices = await navigator.mediaDevices.enumerateDevices();
  let video = devices.filter(d => d.kind === 'videoinput' && hasId(d));
  let audio = devices.filter(d => d.kind === 'audioinput' && hasId(d));

  if (video.length === 0 || audio.length === 0) {
    const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    tempStream.getTracks().forEach(t => t.stop());
    devices = await navigator.mediaDevices.enumerateDevices();
    video = devices.filter(d => d.kind === 'videoinput' && hasId(d));
    audio = devices.filter(d => d.kind === 'audioinput' && hasId(d));
  }
  return { video, audio };
}

export function useShadowCast() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [resolution, setResolution] = useState(null);
  const [availableResolutions, setAvailableResolutions] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedAudioId, setSelectedAudioId] = useState(null);

  // Get persisted settings from store
  const storeVolume = useSwitchStore((s) => s.volume);
  const storeMuted = useSwitchStore((s) => s.muted);
  const lastVideoDeviceId = useSwitchStore((s) => s.lastVideoDeviceId);
  const lastAudioDeviceId = useSwitchStore((s) => s.lastAudioDeviceId);
  const lastResolution = useSwitchStore((s) => s.lastResolution);
  
  const setStoreVolume = useSwitchStore((s) => s.setVolume);
  const setStoreMuted = useSwitchStore((s) => s.setMuted);
  const setLastVideoDeviceId = useSwitchStore((s) => s.setLastVideoDeviceId);
  const setLastAudioDeviceId = useSwitchStore((s) => s.setLastAudioDeviceId);
  const setLastResolution = useSwitchStore((s) => s.setLastResolution);

  const volumeRef = useRef(storeVolume);
  const mutedRef = useRef(storeMuted);

  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);
  const videoRef = useRef(null);
  const videoTrackRef = useRef(null);
  const rafvfcRef = useRef(null);
  const frameCountRef = useRef(0);
  const fpsIntervalRef = useRef(null);
  const fpsRef = useRef(null);
  const intentionalStopRef = useRef(false);

  const teardown = useCallback(() => {
    intentionalStopRef.current = true;
    if (rafvfcRef.current && videoRef.current?.cancelVideoFrameCallback) {
      videoRef.current.cancelVideoFrameCallback(rafvfcRef.current);
      rafvfcRef.current = null;
    }
    clearInterval(fpsIntervalRef.current);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    videoTrackRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
      gainRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    fpsRef.current = null;
    setResolution(null);
    setAvailableResolutions([]);
  }, []);

  const stop = useCallback(() => {
    teardown();
    setStatus('stopped');
  }, [teardown]);

  const setVolume = useCallback((v) => {
    volumeRef.current = v;
    setStoreVolume(v);
    if (gainRef.current) {
      gainRef.current.gain.value = mutedRef.current ? 0 : v;
    }
  }, [setStoreVolume]);

  const updateGainDirectly = useCallback((v) => {
    if (gainRef.current) {
      gainRef.current.gain.value = mutedRef.current ? 0 : v;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setStoreMuted(next);
    if (gainRef.current) {
      gainRef.current.gain.value = next ? 0 : volumeRef.current;
    }
  }, [setStoreMuted]);

  const startWithDevices = useCallback(async (videoEl, vidId, audId, res) => {
    intentionalStopRef.current = false;
    setError(null);
    setStatus('detecting');
    videoRef.current = videoEl;

    try {
      const { video, audio } = await enumerateUsableDevices();
      setVideoDevices(video);
      setAudioDevices(audio);

      if (video.length === 0) {
        setStatus('prompting');
        // Re-run after permission prompt already happened inside enumerateUsableDevices
        setError('No video capture device found. Make sure a capture card or camera is plugged in.');
        setStatus('error');
        return;
      }
      if (audio.length === 0) {
        setError('No audio input device found. Make sure a capture card or microphone is plugged in.');
        setStatus('error');
        return;
      }

      // Use persisted device IDs if available, otherwise use provided or first available
      const chosenVideo = (vidId && video.find(d => d.deviceId === vidId)) || 
                          (!vidId && lastVideoDeviceId && video.find(d => d.deviceId === lastVideoDeviceId)) ||
                          video[0];
      const chosenAudio = (audId && audio.find(d => d.deviceId === audId)) || 
                          (!audId && lastAudioDeviceId && audio.find(d => d.deviceId === lastAudioDeviceId)) ||
                          audio[0];
      
      setSelectedVideoId(chosenVideo.deviceId);
      setSelectedAudioId(chosenAudio.deviceId);
      
      // Persist device selection
      setLastVideoDeviceId(chosenVideo.deviceId);
      setLastAudioDeviceId(chosenAudio.deviceId);

      // Use persisted resolution if available
      const targetRes = res || lastResolution;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: chosenVideo.deviceId },
          width: { ideal: targetRes?.w ?? 1280 },
          height: { ideal: targetRes?.h ?? 720 },
          frameRate: { ideal: 60 },
        },
        audio: {
          deviceId: { exact: chosenAudio.deviceId },
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          latency: { ideal: 0 },
        },
      });

      streamRef.current = stream;

      const videoTrack = stream.getVideoTracks()[0];
      videoTrackRef.current = videoTrack;
      const audioTrack = stream.getAudioTracks()[0];

      const videoOnlyStream = new MediaStream([videoTrack]);
      const audioOnlyStream = new MediaStream([audioTrack]);

      const audioCtx = new AudioContext({ latencyHint: 'interactive' });
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(audioOnlyStream);
      const gain = audioCtx.createGain();
      gain.gain.value = mutedRef.current ? 0 : volumeRef.current;
      gainRef.current = gain;
      source.connect(gain);
      gain.connect(audioCtx.destination);

      videoEl.srcObject = videoOnlyStream;

      const settings = videoTrack.getSettings();
      const currentRes = { w: settings.width, h: settings.height };
      setResolution(currentRes);
      setLastResolution(currentRes);

      const caps = videoTrack.getCapabilities?.();
      if (caps?.width?.max && caps?.height?.max) {
        const supported = CANDIDATE_RESOLUTIONS.filter(
          r => r.w <= caps.width.max && r.h <= caps.height.max
        );
        setAvailableResolutions(supported.length > 0 ? supported : [currentRes]);
      } else {
        setAvailableResolutions([currentRes]);
      }

      videoTrack.addEventListener('ended', () => {
        if (intentionalStopRef.current) return;
        teardown();
        setStatus('error');
        setError('Capture device disconnected. Reconnect the device and try again.');
      });

      if (videoEl.requestVideoFrameCallback) {
        frameCountRef.current = 0;
        fpsIntervalRef.current = setInterval(() => {
          fpsRef.current = frameCountRef.current;
          frameCountRef.current = 0;
        }, 1000);

        const vfc = () => {
          frameCountRef.current++;
          rafvfcRef.current = videoEl.requestVideoFrameCallback(vfc);
        };
        rafvfcRef.current = videoEl.requestVideoFrameCallback(vfc);
      }

      setStatus('streaming');
    } catch (err) {
      let msg = err.message || 'Unknown error';
      if (err.name === 'NotAllowedError') {
        msg = 'Camera/microphone permission denied. Allow access in your browser and try again.';
      } else if (err.name === 'NotReadableError') {
        msg = 'Device is in use by another application. Close other apps and try again.';
      } else if (err.name === 'NotFoundError') {
        msg = 'Capture device not found. Check that your camera or capture card is connected.';
      }
      setError(msg);
      setStatus('error');
    }
  }, [teardown, lastVideoDeviceId, lastAudioDeviceId, lastResolution, setLastVideoDeviceId, setLastAudioDeviceId, setLastResolution]);

  const start = useCallback((videoEl) => {
    return startWithDevices(videoEl, null, null);
  }, [startWithDevices]);

  const switchDevice = useCallback(async (type, deviceId) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const vidId = type === 'video' ? deviceId : selectedVideoId;
    const audId = type === 'audio' ? deviceId : selectedAudioId;
    teardown();
    await startWithDevices(videoEl, vidId, audId);
  }, [teardown, startWithDevices, selectedVideoId, selectedAudioId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFps = useCallback(() => fpsRef.current, []);

  const applyResolution = useCallback(async ({ w, h }) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    teardown();
    await startWithDevices(videoEl, selectedVideoId, selectedAudioId, { w, h });
  }, [teardown, startWithDevices, selectedVideoId, selectedAudioId]);

  return { 
    status, 
    error, 
    resolution, 
    availableResolutions, 
    videoDevices, 
    audioDevices, 
    selectedVideoId, 
    selectedAudioId, 
    getFps, 
    volume: storeVolume, 
    muted: storeMuted, 
    start, 
    stop, 
    switchDevice, 
    setVolume, 
    updateGainDirectly, 
    toggleMute, 
    applyResolution 
  };
}