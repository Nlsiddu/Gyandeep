import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Square, RotateCcw, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { store } from '../store';

const LESSON_ID = 'animation-1';

export default function AnimationLesson({ isOnline }: { isOnline: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [completed, setCompleted] = useState(store.state.completedLessons.includes(LESSON_ID));
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeSpent((t) => {
          if (t + 1 >= 10 && !completed) {
            store.markLessonComplete(LESSON_ID);
            setCompleted(true);
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, completed]);

  return (
    <div className="animate-fade-in">
      <Link to="/" className="btn btn-secondary mb-4">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="glass-panel p-6">
        <div className="flex-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Concept Physics: Orbit Simulator</h2>
            <p className="text-muted mt-2">Interact with the simulation to understand how speed affects orbital motion. Spend at least 10 seconds interacting to complete the lesson.</p>
          </div>
          {completed && (
            <div className="flex-gap text-success">
              <CheckCircle /> <span className="font-bold">Completed</span>
            </div>
          )}
        </div>

        <div className="card mb-6" style={{ background: '#000', overflow: 'hidden', position: 'relative', height: '400px' }}>
          {/* Simulation View */}
          <div className="flex-center" style={{ height: '100%', position: 'relative' }}>
            <div 
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #eab308, #f97316)',
                borderRadius: '50%',
                position: 'absolute',
                boxShadow: '0 0 40px rgba(234, 179, 8, 0.4)'
              }}
            />
            
            <div 
              style={{
                width: '300px',
                height: '300px',
                border: '1px dashed rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                position: 'absolute',
                animation: isPlaying ? `spin ${10 / speed}s linear infinite` : 'none',
                transformOrigin: 'center center',
              }}
            >
              <div 
                style={{
                  width: '24px',
                  height: '24px',
                  background: 'var(--accent)',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '-12px',
                  left: '138px',
                  boxShadow: '0 0 15px var(--accent)'
                }}
              />
            </div>
          </div>
          
          <style>{`
            @keyframes spin {
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <div className="flex-between p-4" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
          <div className="flex-gap">
            <button 
              className={`btn ${isPlaying ? 'btn-outline' : 'btn-primary'}`} 
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Square size={18} /> : <Play size={18} />}
              {isPlaying ? 'Stop' : 'Start Simulation'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setIsPlaying(false); setSpeed(1); setTimeSpent(0); }}
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>

          <div className="flex-gap" style={{ minWidth: '300px' }}>
            <span className="font-bold text-sm">Orbital Speed</span>
            <input 
              type="range" 
              min="0.5" 
              max="3" 
              step="0.1" 
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent)' }}
            />
            <span className="text-sm text-muted">{speed}x</span>
          </div>
        </div>

        {!isOnline && (
          <div className="mt-4 text-sm text-muted">
            <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
            This interactive animation works entirely offline.
          </div>
        )}
      </div>
    </div>
  );
}
