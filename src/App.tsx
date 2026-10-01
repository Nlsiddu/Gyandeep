import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, BookOpen, Video, Headphones, Download, CheckCircle, AlertCircle, PlayCircle, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { store, downloadMedia } from './store';
import VideoLesson from './components/VideoLesson';
import AudioLesson from './components/AudioLesson';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import AnimationLesson from './components/AnimationLesson';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        {!isOnline && (
          <div className="offline-banner">
            <WifiOff size={18} />
            YOU ARE OFFLINE - Showing downloaded content and saved progress
          </div>
        )}
        
        <header className="flex-between mb-8" style={{ marginTop: isOnline ? '0' : '1rem' }}>
          <Link to="/" className="flex-gap">
            <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
              <BrainCircuit color="white" />
            </div>
            <h1 className="title" style={{ fontSize: '1.8rem', marginBottom: 0 }}>Nexus Learning</h1>
          </Link>
          <div className="flex-gap">
            <span style={{ color: isOnline ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard isOnline={isOnline} />} />
            <Route path="/video" element={<VideoLesson isOnline={isOnline} />} />
            <Route path="/audio" element={<AudioLesson isOnline={isOnline} />} />
            <Route path="/animation" element={<AnimationLesson isOnline={isOnline} />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
