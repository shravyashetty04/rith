import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, ChevronLeft,
  SkipForward, SkipBack, PictureInPicture, Subtitles, Languages, Rewind, FastForward,
  Check, Gauge, Loader2, Radio,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../store';
import { getTitle } from '../data';

type Quality = 'Auto' | '4K' | '1080p' | '720p' | '480p';
type Speed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

const QUALITIES: Quality[] = ['Auto', '4K', '1080p', '720p', '480p'];
const SPEEDS: Speed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SUBS = ['Off', 'English', 'Spanish', 'Hindi', 'Japanese', 'French'];
const AUDIOS = ['English', 'Hindi', 'Spanish', 'Japanese'];

export default function Player({ id, episodeId }: { id: string; episodeId?: string }) {
  const { back, navigate, setProgress } = useApp();
  const title = getTitle(id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [menu, setMenu] = useState<null | 'settings' | 'quality' | 'speed' | 'subs' | 'audio'>(null);
  const [quality, setQuality] = useState<Quality>('Auto');
  const [speed, setSpeed] = useState<Speed>(1);
  const [sub, setSub] = useState('English');
  const [audio, setAudio] = useState('English');
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [seekHover, setSeekHover] = useState<number | null>(null);

  const episode = title?.episodes?.find((e) => e.id === episodeId) || title?.episodes?.[0];
  const videoSrc = episode?.videoUrl || title?.videoUrl || '';

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }, []);

  const seek = (t: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = t;
  };

  const skip = (delta: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0);
  };

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  const togglePip = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch { /* noop */ }
  };

  const pingControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3200);
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft': skip(-10); break;
        case 'ArrowRight': skip(10); break;
        case 'j': skip(-10); break;
        case 'l': skip(10); break;
        case 'f': toggleFullscreen(); break;
        case 'm': setMuted((m) => !m); break;
        case 'ArrowUp': setVolume((v) => Math.min(1, v + 0.1)); break;
        case 'ArrowDown': setVolume((v) => Math.max(0, v - 0.1)); break;
        default:
      }
      pingControls();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, toggleFullscreen, pingControls]);

  // Video events
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => { setPlaying(true); pingControls(); };
    const onPause = () => setPlaying(false);
    const onTime = () => {
      setCurrent(v.currentTime);
      setProgress(id, (v.currentTime / (v.duration || 1)) * 100);
      // skip intro cue 15-45s
      setShowSkipIntro(v.currentTime > 12 && v.currentTime < 48);
      // next episode cue
      if (v.duration && v.currentTime > v.duration - 30) setShowNext(true);
      else setShowNext(false);
    };
    const onDur = () => setDuration(v.duration);
    const onProg = () => {
      if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
    };
    const onWait = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('durationchange', onDur);
    v.addEventListener('progress', onProg);
    v.addEventListener('waiting', onWait);
    v.addEventListener('canplay', onCanPlay);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('durationchange', onDur);
      v.removeEventListener('progress', onProg);
      v.removeEventListener('waiting', onWait);
      v.removeEventListener('canplay', onCanPlay);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, [id, setProgress, pingControls]);

  // Apply volume/mute/speed
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = muted;
    v.playbackRate = speed;
  }, [volume, muted, speed]);

  const fmt = (s: number) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    const h = Math.floor(m / 60);
    return h ? `${h}:${String(m % 60).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
  };

  if (!title) return <div className="pt-24 text-center">Title not found.</div>;

  const seekPct = duration ? (current / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[100] overflow-hidden select-none cursor-default"
      onMouseMove={pingControls}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('[data-ctrl]')) return;
        pingControls();
      }}
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 size={56} className="text-brand-500 animate-spin" />
        </div>
      )}

      {/* Skip Intro */}
      <AnimatePresence>
        {showSkipIntro && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => seek(48)}
            className="absolute bottom-32 right-6 sm:right-10 px-5 py-2.5 rounded-lg glass-strong border border-white/30 font-semibold text-sm hover:bg-white/15 transition-colors z-20"
          >
            Skip Intro ›
          </motion.button>
        )}
      </AnimatePresence>

      {/* Next Episode */}
      <AnimatePresence>
        {showNext && title.episodes && (
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            onClick={() => {
              const next = title.episodes?.find((e) => e.episode === (episode?.episode || 0) + 1);
              if (next) navigate({ name: 'player', id: title.id, episodeId: next.id });
            }}
            className="absolute bottom-32 right-6 sm:right-10 flex items-center gap-2 px-5 py-2.5 rounded-lg brand-gradient font-semibold text-sm hover:scale-105 transition-transform z-20"
          >
            <SkipForward size={16} /> Next Episode
          </motion.button>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 bg-gradient-to-b from-black/70 to-transparent flex items-center gap-4"
          >
            <button onClick={back} className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors" data-ctrl>
              <ChevronLeft size={22} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white/60">{title.type === 'series' ? `S${episode?.season}:E${episode?.episode} • ${title.title}` : title.title}</div>
              <div className="text-lg font-bold truncate">{episode?.title || title.title}</div>
            </div>
            {title.type === 'live' && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-500 text-xs font-bold">
                <Radio size={12} /> LIVE
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center play/pause big */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center gap-8 pointer-events-none"
          >
            <button onClick={() => skip(-10)} className="pointer-events-auto w-14 h-14 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform" data-ctrl>
              <Rewind size={24} />
            </button>
            <button onClick={togglePlay} className="pointer-events-auto w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center hover:scale-110 transition-transform" data-ctrl>
              {playing ? <Pause size={36} className="fill-white" /> : <Play size={36} className="fill-white ml-1" />}
            </button>
            <button onClick={() => skip(10)} className="pointer-events-auto w-14 h-14 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform" data-ctrl>
              <FastForward size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 pb-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
          >
            {/* Seek bar */}
            <div className="relative mb-3 group">
              <div
                className="relative h-1.5 bg-white/20 rounded-full cursor-pointer"
                onClick={(e) => {
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  seek(((e.clientX - r.left) / r.width) * duration);
                }}
                onMouseMove={(e) => {
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setSeekHover(((e.clientX - r.left) / r.width) * duration);
                }}
                onMouseLeave={() => setSeekHover(null)}
              >
                <div className="absolute inset-y-0 left-0 bg-white/25 rounded-full" style={{ width: `${bufPct}%` }} />
                <div className="absolute inset-y-0 left-0 brand-gradient rounded-full" style={{ width: `${seekPct}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-brand-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${seekPct}% - 7px)` }}
                />
              </div>
              {seekHover !== null && (
                <div
                  className="absolute -top-8 px-2 py-0.5 rounded glass-strong text-xs pointer-events-none -translate-x-1/2"
                  style={{ left: `${(seekHover / duration) * 100}%` }}
                >
                  {fmt(seekHover)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-lg transition-colors" data-ctrl>
                {playing ? <Pause size={22} className="fill-white" /> : <Play size={22} className="fill-white" />}
              </button>
              <button onClick={() => skip(-10)} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block" data-ctrl>
                <SkipBack size={20} />
              </button>
              <button onClick={() => skip(10)} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block" data-ctrl>
                <SkipForward size={20} />
              </button>

              <div className="flex items-center gap-2 group/vol">
                <button onClick={() => setMuted((m) => !m)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" data-ctrl>
                  {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                  className="w-0 group-hover/vol:w-20 transition-all accent-brand-500"
                />
              </div>

              <div className="text-xs sm:text-sm text-white/80 ml-1">
                <span className="font-medium">{fmt(current)}</span>
                <span className="text-white/40"> / {fmt(duration)}</span>
              </div>

              <div className="flex-1" />

              {/* Settings menu */}
              <div className="relative" data-ctrl>
                <button
                  onClick={() => setMenu((m) => (m === 'settings' ? null : 'settings'))}
                  className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${menu ? 'bg-white/10' : ''}`}
                >
                  <Settings size={20} />
                </button>
                <AnimatePresence>
                  {menu === 'settings' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      className="absolute bottom-12 right-0 w-56 glass-strong rounded-xl shadow-2xl border border-white/10 overflow-hidden"
                    >
                      {[
                        { key: 'quality', icon: Gauge, label: 'Quality', value: quality },
                        { key: 'speed', icon: Gauge, label: 'Playback Speed', value: `${speed}x` },
                        { key: 'subs', icon: Subtitles, label: 'Subtitles', value: sub },
                        { key: 'audio', icon: Languages, label: 'Audio', value: audio },
                      ].map((item) => (
                        <button
                          key={item.key}
                          onClick={() => setMenu(item.key as typeof menu)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors text-sm"
                        >
                          <span className="flex items-center gap-3"><item.icon size={16} /> {item.label}</span>
                          <span className="text-white/60 text-xs">{item.value} ›</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submenus */}
                {(['quality', 'speed', 'subs', 'audio'] as const).map((m) => (
                  <AnimatePresence key={m}>
                    {menu === m && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute bottom-12 right-0 w-56 glass-strong rounded-xl shadow-2xl border border-white/10 overflow-hidden"
                      >
                        <button onClick={() => setMenu('settings')} className="w-full px-4 py-2.5 text-left text-xs text-white/50 border-b border-white/10">
                          ‹ {m === 'quality' ? 'Quality' : m === 'speed' ? 'Playback Speed' : m === 'subs' ? 'Subtitles' : 'Audio'}
                        </button>
                        {(m === 'quality' ? QUALITIES : m === 'speed' ? SPEEDS : m === 'subs' ? SUBS : AUDIOS).map((opt) => {
                          const active = m === 'quality' ? quality === opt : m === 'speed' ? speed === opt : m === 'subs' ? sub === opt : audio === opt;
                          return (
                            <button
                              key={String(opt)}
                              onClick={() => {
                                if (m === 'quality') setQuality(opt as Quality);
                                else if (m === 'speed') setSpeed(opt as Speed);
                                else if (m === 'subs') setSub(opt as string);
                                else setAudio(opt as string);
                                setMenu('settings');
                              }}
                              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/10 transition-colors text-sm"
                            >
                              <span>{m === 'speed' ? `${opt}x` : opt}</span>
                              {active && <Check size={16} className="text-brand-500" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>

              <button onClick={togglePip} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block" data-ctrl>
                <PictureInPicture size={20} />
              </button>
              <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-lg transition-colors" data-ctrl>
                {fullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap zones for mobile */}
      <button
        className="absolute inset-0 z-10 sm:hidden"
        onClick={(e) => { e.stopPropagation(); togglePlay(); pingControls(); }}
        aria-label="Toggle play"
      />
    </div>
  );
}
