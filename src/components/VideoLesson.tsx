import React, { useState, useEffect, useRef } from 'react';
import { Download, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { store, downloadMedia } from '../store';

const VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const LESSON_ID = 'video-1';

export default function VideoLesson({ isOnline }: { isOnline: boolean }) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(store.isDownloaded(LESSON_ID));
  const [completed, setCompleted] = useState(store.state.completedLessons.includes(LESSON_ID));
  const videoRef = useRef<HTMLVideoElement>(null);
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
    const success = await downloadMedia(VIDEO_URL, LESSON_ID);
    setDownloading(false);
    if (success) {
      setDownloaded(true);
    } else {
      alert("Download failed. Please try again.");
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
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
        <div className="flex-between mb-4">
          <h2 className="text-3xl font-bold">The Solar System</h2>
          {completed && (
            <div className="flex-gap text-success">
              <CheckCircle /> <span className="font-bold">Completed</span>
            </div>
          )}
        </div>

        {error ? (
          <div className="card mb-6" style={{ borderColor: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <div className="flex-gap text-error font-bold mb-2">
              <AlertCircle /> Video failed to load.
            </div>
            <p>Please check your connection. {downloaded ? 'Try refreshing to use the offline version.' : 'Connect to the internet to stream or download this video.'}</p>
            <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <div className="media-container">
            <video 
              ref={videoRef}
              controls 
              onTimeUpdate={handleTimeUpdate}
              onError={handleError}
              preload="metadata"
              crossOrigin="anonymous"
            >
              <source src={VIDEO_URL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="flex-between mt-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Lesson Details</h3>
            <p className="text-muted">Watch this interactive video to understand planetary orbits and gravity. Make sure to watch until the end to complete the lesson.</p>
          </div>
          
          <div>
            {!downloaded ? (
              <button 
                className="btn btn-primary" 
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
