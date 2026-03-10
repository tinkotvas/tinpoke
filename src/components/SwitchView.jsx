import { memo, useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { Flex, Button, Slider, Select, Typography, theme } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  FullscreenOutlined,
  SoundOutlined,
  MutedOutlined,
  VideoCameraOutlined,
  AudioOutlined,
} from '@ant-design/icons';
import { useCaptureDevice } from '../hooks/useCaptureDevice.js';
import { useControlsVisibilityStore } from '../stores/controlsVisibilityStore.js';
import QuickCatch from './QuickCatch.jsx';

const { Text } = Typography;

const STATUS_LABELS = {
  idle: 'Ready',
  detecting: 'Detecting devices…',
  prompting: 'Allow camera & microphone access…',
  streaming: null,
  error: null,
  stopped: 'Stopped',
};

const createVideoStyle = (token) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  display: 'block',
  willChange: 'transform',
  imageRendering: 'pixelated',
  background: token.colorBgLayout,
});

const createContainerStyle = (token) => ({
  height: '100%',
  background: token.colorBgLayout,
  position: 'relative',
  overflow: 'hidden',
  contain: 'layout paint',
});

const FpsDisplay = memo(function FpsDisplay({ getFps, showControls, resolution }) {
  const [fps, setFps] = useState(null);

  useEffect(() => {
    if (!showControls) return;
    const interval = setInterval(() => {
      setFps(getFps());
    }, 1000);
    return () => clearInterval(interval);
  }, [getFps, showControls]);

  if (!showControls || fps == null || !resolution) return null;
  return <>{` @ ${fps}fps`}</>;
});

const SwitchView = memo(function SwitchView() {
  const { token } = theme.useToken();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  
  // Use shared visibility store
  const showControls = useControlsVisibilityStore((s) => s.showControls);
  const setShowControls = useControlsVisibilityStore((s) => s.setShowControls);
  const getShowControls = useControlsVisibilityStore((s) => s.getShowControls);

  const { status, error, resolution, availableResolutions, videoDevices, audioDevices, selectedVideoId, selectedAudioId, getFps, volume, muted, start, stop, switchDevice, setVolume, updateGainDirectly, toggleMute, applyResolution } =
    useCaptureDevice();

  const [dragVolume, setDragVolume] = useState(volume);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isDragging.current) {
      setDragVolume(volume);
    }
  }, [volume]);

  const handleStart = useCallback(() => {
    if (videoRef.current) {
      start(videoRef.current);
    }
  }, [start]);

  const handleFullscreen = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen?.();
    }
  }, []);

  const isStreaming = status === 'streaming';
  const isLoading = status === 'detecting' || status === 'prompting';

  useEffect(() => {
    const handleMouseMove = () => {
      if (!getShowControls()) {
        setShowControls(true);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        if (isStreaming) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseMove);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isStreaming]);

  useEffect(() => {
    if (!isStreaming) {
      setShowControls(true);
    }
  }, [isStreaming]);

  const overlayStyle = useMemo(() => ({
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    flexDirection: 'column',
    gap: token.marginSM,
  }), [token.marginSM]);

  const controlsBarStyle = useMemo(() => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: `${token.paddingSM}px ${token.paddingMD}px`,
    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
    opacity: showControls ? 1 : 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: showControls ? 'auto' : 'none',
  }), [token.paddingSM, token.paddingMD, showControls]);

  let statusText = STATUS_LABELS[status];
  if (isStreaming && resolution) {
    statusText = `${resolution.w}×${resolution.h}`;
  }
  if (status === 'error') {
    statusText = error;
  }

  const videoStyle = useMemo(() => createVideoStyle(token), [token]);
  const containerStyle = useMemo(() => createContainerStyle(token), [token]);

  return (
    <Flex
      ref={containerRef}
      vertical
      style={containerStyle}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={videoStyle}
      />

      {!isStreaming && (
        <Flex
          align="center"
          justify="center"
          style={overlayStyle}
        >
          {(status === 'idle' || status === 'stopped') && (
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={handleStart}
            >
              Start Switch Feed
            </Button>
          )}

          {isLoading && (
            <Text style={{ color: token.colorText, fontSize: 15 }}>{statusText}</Text>
          )}

          {status === 'error' && (
            <Flex vertical align="center" gap={token.marginXS}>
              <Text style={{ color: token.colorError, textAlign: 'center', maxWidth: 380, fontSize: 14 }}>
                {statusText}
              </Text>
              <Button onClick={handleStart} icon={<PlayCircleOutlined />}>
                Retry
              </Button>
            </Flex>
          )}
        </Flex>
      )}

      {/* Controls bar - anchored to bottom */}
      <Flex
        align="center"
        gap={token.marginSM}
        style={controlsBarStyle}
      >
        {/* Start / Stop */}
        {isStreaming ? (
          <Button
            icon={<PauseCircleOutlined />}
            onClick={stop}
            size="small"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
          >
            Stop
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleStart}
            loading={isLoading}
            size="small"
          >
            Start
          </Button>
        )}

        {/* Mute toggle */}
        <Button
          icon={muted ? <MutedOutlined /> : <SoundOutlined />}
          onClick={toggleMute}
          size="small"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
          title={muted ? 'Unmute' : 'Mute'}
        />

        {/* Volume slider */}
        <Flex align="center" gap={8} style={{ flex: '0 0 140px' }}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={dragVolume}
            onChange={(v) => {
              isDragging.current = true;
              setDragVolume(v);
              updateGainDirectly(v);
            }}
            onChangeComplete={(v) => {
              isDragging.current = false;
              setVolume(v);
            }}
            disabled={muted}
            tooltip={{ formatter: v => `${Math.round(v * 100)}%` }}
            style={{ flex: 1, margin: 0 }}
          />
        </Flex>

        {/* Video source picker */}
        {isStreaming && videoDevices.length > 1 && (
          <Select
            size="small"
            value={selectedVideoId}
            onChange={(id) => switchDevice('video', id)}
            options={videoDevices.map(d => ({
              value: d.deviceId,
              label: d.label || `Camera ${videoDevices.indexOf(d) + 1}`,
            }))}
            suffixIcon={<VideoCameraOutlined style={{ color: '#fff' }} />}
            style={{ minWidth: 120, fontSize: 12, color: '#fff' }}
            styles={{ selector: { color: '#fff', fontSize: 12 } }}
            variant="borderless"
            popupMatchSelectWidth={false}
          />
        )}

        {/* Audio source picker */}
        {isStreaming && audioDevices.length > 1 && (
          <Select
            size="small"
            value={selectedAudioId}
            onChange={(id) => switchDevice('audio', id)}
            options={audioDevices.map(d => ({
              value: d.deviceId,
              label: d.label || `Mic ${audioDevices.indexOf(d) + 1}`,
            }))}
            suffixIcon={<AudioOutlined style={{ color: '#fff' }} />}
            style={{ minWidth: 120, fontSize: 12, color: '#fff' }}
            styles={{ selector: { color: '#fff', fontSize: 12 } }}
            variant="borderless"
            popupMatchSelectWidth={false}
          />
        )}

        {/* Resolution picker */}
        {isStreaming && availableResolutions.length > 1 && (
          <Select
            size="small"
            value={resolution ? `${resolution.w}x${resolution.h}` : undefined}
            onChange={(val) => {
              const [w, h] = val.split('x').map(Number);
              applyResolution({ w, h });
            }}
            options={availableResolutions.map(r => ({
              value: `${r.w}x${r.h}`,
              label: `${r.w}×${r.h}`,
            }))}
            style={{ minWidth: 100, fontSize: 12, color: '#fff' }}
            styles={{ selector: { color: '#fff', fontSize: 12 } }}
            variant="borderless"
            popupMatchSelectWidth={false}
          />
        )}

        {/* Status text */}
        {statusText && (
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              color: status === 'error' ? token.colorError : '#fff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {statusText}
            {isStreaming && (
              <FpsDisplay getFps={getFps} showControls={showControls} resolution={resolution} />
            )}
          </Text>
        )}

        {/* Fullscreen */}
        <Button
          icon={<FullscreenOutlined />}
          onClick={handleFullscreen}
          size="small"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
          title="Fullscreen"
          disabled={!isStreaming}
        />
      </Flex>

      {/* Quick Catch button - above fullscreen */}
      <QuickCatch />
    </Flex>
  );
});

export default SwitchView;
