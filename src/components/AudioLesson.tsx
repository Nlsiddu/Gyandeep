import React, { useState, useEffect, useRef } from 'react';
import { Download, CheckCircle, ArrowLeft, AlertCircle, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { store, downloadMedia } from '../store';

const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const LESSON_ID = 'audio-1';

export default function AudioLesson({ isOnline }: { isOnline: boolean }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(store.isDownloaded(LESSON_ID));
  const [completed, setCompleted] = useState(store.state.completedLessons.includes(LESSON_ID));
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setDownloaded(store.isDownloaded(LESSON_ID));
  }, []);

  const handleDownload = async () => {
    if (!isOnline) {
      alert("Please connect to internet to download.");
      return;
    }
    setDownloading(true);
    const success = await downloadMedia(AUDIO_URL, LESSON_ID);
    setDownloading(false);
    if (success) {
      setDownloaded(true);
    } else {
      alert("Download failed. Please try again.");
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (currentTime / duration > 0.9 && !completed) {
        store.markLessonComplete(LESSON_ID);
        setCompleted(true);
      }
    }
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className="animate-fade-in">
      <Link to="/" className="btn btn-secondary mb-4">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="glass-panel p-6">
        <div className="flex-between mb-6">
          <div>
            <div className="flex-gap mb-2">
              <Headphones size={24} color="var(--secondary)" />
              <h2 className="text-3xl font-bold">Focus Sounds: Alpha Waves</h2>
            </div>
            <p className="text-muted">Listen to this audio track to improve your concentration and focus while studying.</p>
          </div>
          {completed && (
            <div className="flex-gap text-success">
              <CheckCircle /> <span className="font-bold">Completed</span>
            </div>
          )}
        </div>

        {error ? (
          <div className="card mb-6" style={{ borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div className="flex-gap text-error font-bold mb-2">
              <AlertCircle /> Audio failed to load.
            </div>
            <p>Please check your connection. {downloaded ? 'Try refreshing to use the offline version.' : 'Connect to the internet to stream or download this audio.'}</p>
            <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="audio-player mb-6">
            <h3 className="font-bold mb-2">Audio Player</h3>
            <audio 
              ref={audioRef}
              controls 
              style={{ width: '100%' }}
              onTimeUpdate={handleTimeUpdate}
              onError={handleError}
              preload="metadata"
              crossOrigin="anonymous"
            >
              <source src={AUDIO_URL} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="flex-between mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <p className="font-bold mb-1">Offline Access</p>
            <p className="text-sm text-muted">Download this audio to listen when you don't have internet.</p>
          </div>
          
          <div>
            {!downloaded ? (
              <button 
                className="btn btn-primary" 
                style={{ background: 'var(--secondary)' }}
                onClick={handleDownload}
                disabled={downloading || !isOnline}
              >
                <Download size={18} />
                {downloading ? 'Downloading...' : 'Download for Offline'}
              </button>
            ) : (
              <div className="btn btn-success" style={{ cursor: 'default' }}>
                <CheckCircle size={18} />
                Downloaded (Available Offline)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
