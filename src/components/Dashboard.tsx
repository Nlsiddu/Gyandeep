import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Headphones, BrainCircuit, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { store, type CourseProgress } from '../store';

export default function Dashboard({ isOnline }: { isOnline: boolean }) {
  const [progress, setProgress] = useState<CourseProgress>(store.state);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setProgress(store.state);
    });
    return unsubscribe;
  }, []);

  const totalLessons = 4;
  const completedCount = progress.completedLessons.length;
  const percentage = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="animate-fade-in">
      <div className="glass-panel p-6 mb-8">
        <h2 className="title text-gradient">Your Learning Journey</h2>
        <p className="subtitle">Pick up right where you left off.</p>
        
        <div className="flex-between mb-2">
          <span className="font-bold">Course Progress</span>
          <span className="text-primary font-bold">{percentage}%</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      {progress.learningGaps.length > 0 && (
        <div className="card mb-8" style={{ borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.05)' }}>
          <div className="flex-gap mb-4">
            <AlertCircle color="var(--warning)" size={24} />
            <h3 className="text-xl font-bold">Learning Gap Detected</h3>
          </div>
          <p className="mb-4">You recently struggled with {progress.learningGaps.join(', ')}. We recommend reviewing the foundational concepts.</p>
          <Link to="/animation" className="btn btn-outline" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>
            Review Concept Animations
          </Link>
        </div>
      )}

      <h3 className="text-2xl font-bold mb-4 mt-8">Modules</h3>
      <div className="grid grid-cols-2">
        
        <div className="card">
          <div className="flex-between mb-4">
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <PlayCircle color="var(--primary)" size={28} />
            </div>
            {progress.completedLessons.includes('video-1') ? (
              <CheckCircle color="var(--success)" />
            ) : null}
          </div>
          <h3 className="text-xl font-bold mb-2">Video Lesson: The Solar System</h3>
          <p className="text-muted mb-4">Watch and learn about the planets in our solar system.</p>
          <Link to="/video" className="btn btn-primary w-full" style={{ width: '100%' }}>
            {progress.completedLessons.includes('video-1') ? 'Watch Again' : 'Start Lesson'}
          </Link>
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <Headphones color="var(--secondary)" size={28} />
            </div>
            {progress.completedLessons.includes('audio-1') ? (
              <CheckCircle color="var(--success)" />
            ) : null}
          </div>
          <h3 className="text-xl font-bold mb-2">Audio Lesson: Focus Sounds</h3>
          <p className="text-muted mb-4">Listen to this audio track to improve your concentration.</p>
          <Link to="/audio" className="btn btn-primary w-full" style={{ width: '100%', background: 'var(--secondary)' }}>
            {progress.completedLessons.includes('audio-1') ? 'Listen Again' : 'Start Audio'}
          </Link>
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <div style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <Sparkles color="var(--accent)" size={28} />
            </div>
            {progress.completedLessons.includes('animation-1') ? (
              <CheckCircle color="var(--success)" />
            ) : null}
          </div>
          <h3 className="text-xl font-bold mb-2">Interactive: Concept Physics</h3>
          <p className="text-muted mb-4">Experience concepts with interactive animations.</p>
          <Link to="/animation" className="btn btn-primary w-full" style={{ width: '100%', background: 'var(--accent)' }}>
            {progress.completedLessons.includes('animation-1') ? 'Review Animation' : 'Start Interactive'}
          </Link>
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem', borderRadius: '12px' }}>
              <BrainCircuit color="var(--success)" size={28} />
            </div>
            {progress.quizScores['quiz-1'] !== undefined ? (
              <div className="text-success font-bold">Score: {progress.quizScores['quiz-1']}%</div>
            ) : null}
          </div>
          <h3 className="text-xl font-bold mb-2">Knowledge Check</h3>
          <p className="text-muted mb-4">Test your understanding of the concepts learned so far.</p>
          <Link to="/quiz" className="btn btn-outline w-full" style={{ width: '100%' }}>
            {progress.quizScores['quiz-1'] !== undefined ? 'Retake Quiz' : 'Start Quiz'}
          </Link>
        </div>

      </div>
    </div>
  );
}
