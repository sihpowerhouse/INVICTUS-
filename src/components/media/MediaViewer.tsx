import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize } from 'lucide-react';
import './MediaViewer.css';

interface MediaViewerProps {
  type: 'AUDIO' | 'VIDEO';
  durationMs: number;
  currentTimeMs: number;
  isPlaying: boolean;
  playbackSpeed: number;
  onTimeChange: (timeMs: number) => void;
  onPlayPause: (playing: boolean) => void;
  onSpeedChange: (speed: number) => void;
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export default function MediaViewer({
  type,
  durationMs,
  currentTimeMs,
  isPlaying,
  playbackSpeed,
  onTimeChange,
  onPlayPause,
  onSpeedChange
}: MediaViewerProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Mock waveform animation state
  const [waveforms, setWaveforms] = useState<number[]>(Array(40).fill(10));

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      // Simulate playback time progression
      if (currentTimeMs < durationMs) {
        onTimeChange(Math.min(currentTimeMs + (100 * playbackSpeed), durationMs));
      } else {
        onPlayPause(false);
      }
      
      // Animate waveform
      if (type === 'AUDIO') {
        setWaveforms(prev => prev.map(() => 10 + Math.random() * 40));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentTimeMs, durationMs, playbackSpeed, onTimeChange, onPlayPause, type]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    onTimeChange(percentage * durationMs);
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTimeMs / durationMs) * 100));

  const skipForward = () => onTimeChange(Math.min(currentTimeMs + 10000, durationMs));
  const skipBackward = () => onTimeChange(Math.max(currentTimeMs - 10000, 0));

  return (
    <div className="media-viewer">
      <div className={`media-viewer__screen ${type === 'AUDIO' ? 'media-viewer__screen--audio' : ''}`}>
        <div className="media-viewer__watermark">INVICTUS SECURE MEDIA DEMO</div>
        
        {type === 'VIDEO' ? (
          <div style={{ color: 'rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '0.2em' }}>
            [VIDEO PLAYBACK SIMULATION]
          </div>
        ) : (
          <div className="media-viewer__waveform-mock">
            {waveforms.map((h, i) => (
              <div key={i} className="media-viewer__wave-bar" style={{ height: `${h}px` }} />
            ))}
          </div>
        )}
      </div>

      <div className="media-viewer__controls">
        <div className="media-viewer__progress-area">
          <span className="media-viewer__time media-viewer__time-current">{formatTime(currentTimeMs)}</span>
          
          <div 
            className="media-viewer__timeline" 
            ref={timelineRef}
            onClick={handleTimelineClick}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={durationMs}
            aria-valuenow={currentTimeMs}
            aria-label="Seek timeline"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') skipForward();
              if (e.key === 'ArrowLeft') skipBackward();
            }}
          >
            <div className="media-viewer__timeline-fill" style={{ width: `${progressPercent}%` }} />
            <div className="media-viewer__timeline-thumb" style={{ left: `${progressPercent}%` }} />
          </div>
          
          <span className="media-viewer__time">{formatTime(durationMs)}</span>
        </div>

        <div className="media-viewer__buttons">
          <div className="media-viewer__btn-group">
            <button className="media-viewer__btn" onClick={skipBackward} aria-label="Skip backward 10s">
              <SkipBack size={18} />
            </button>
            <button 
              className="media-viewer__btn media-viewer__btn--primary" 
              onClick={() => onPlayPause(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <button className="media-viewer__btn" onClick={skipForward} aria-label="Skip forward 10s">
              <SkipForward size={18} />
            </button>
          </div>

          <div className="media-viewer__btn-group">
            <select 
              className="media-viewer__speed-select"
              value={playbackSpeed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              aria-label="Playback speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1.0x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2.0x</option>
            </select>
            <button className="media-viewer__btn" aria-label="Mute">
              <Volume2 size={18} />
            </button>
            <button className="media-viewer__btn" aria-label="Fullscreen">
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
