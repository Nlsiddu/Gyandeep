import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, BrainCircuit, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { store } from '../store';

const QUIZ_ID = 'quiz-1';

const QUESTIONS = [
  {
    id: 1,
    question: "Which force keeps the planets in orbit around the Sun?",
    options: ["Magnetism", "Gravity", "Friction", "Electrostatics"],
    correct: 1,
    explanation: "Gravity is the fundamental force of attraction between masses, keeping planets in orbit.",
    topic: "Physics"
  },
  {
    id: 2,
    question: "What is the primary function of Alpha Brain Waves?",
    options: ["Deep Sleep", "Relaxed Focus", "High Stress", "Muscle Repair"],
    correct: 1,
    explanation: "Alpha waves (8-12 Hz) are associated with a state of relaxed, calm, and lucid focus.",
    topic: "Biology"
  },
  {
    id: 3,
    question: "If an object's orbital speed increases, what happens to its orbit?",
    options: ["It becomes smaller", "It crashes into the center", "It widens and may escape", "Nothing changes"],
    correct: 2,
    explanation: "Higher velocity means the object has more energy to overcome the central gravitational pull, widening the orbit.",
    topic: "Physics"
  }
];

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleNext = () => {
    if (selected === null) return;
    
    const isCorrect = selected === QUESTIONS[currentQ].correct;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      // Calculate results
      const correctCount = newAnswers.filter(a => a).length;
      const score = Math.round((correctCount / QUESTIONS.length) * 100);
      
      // Determine learning gap (simple logic based on wrong answers)
      let gapDetected = undefined;
      if (!isCorrect) {
        gapDetected = QUESTIONS[currentQ].topic;
      }
      
      store.saveQuizScore(QUIZ_ID, score, gapDetected);
      setFinished(true);
    }
  };

  const handleCheck = () => {
    if (selected !== null) {
      setShowResult(true);
    }
  };

  if (finished) {
    const correctCount = answers.filter(a => a).length;
    const score = Math.round((correctCount / QUESTIONS.length) * 100);

    return (
      <div className="animate-fade-in flex-center" style={{ minHeight: '60vh' }}>
        <div className="glass-panel p-6 text-center" style={{ maxWidth: '500px', width: '100%' }}>
          <BrainCircuit size={64} color="var(--primary)" className="mx-auto mb-4" style={{ margin: '0 auto 1rem' }} />
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          
          <div className="flex-center gap-4 my-6" style={{ gap: '2rem' }}>
            <div className="text-center">
              <p className="text-muted">Score</p>
              <p className="text-3xl font-bold text-primary">{score}%</p>
            </div>
            <div className="text-center">
              <p className="text-muted">Correct</p>
              <p className="text-3xl font-bold text-success">{correctCount}/{QUESTIONS.length}</p>
            </div>
          </div>

          {score < 100 ? (
            <div className="card mb-6 text-left" style={{ borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.05)' }}>
              <h3 className="font-bold mb-2 text-warning">Learning Gap Detected</h3>
              <p className="text-sm">We noticed you struggled with some questions. Your dashboard has been updated with a revision plan.</p>
            </div>
          ) : (
            <div className="card mb-6 text-left" style={{ borderColor: 'var(--success)', background: 'rgba(34, 197, 94, 0.05)' }}>
              <h3 className="font-bold mb-2 text-success">Perfect Score!</h3>
              <p className="text-sm">You have mastered all the topics in this module.</p>
            </div>
          )}

          <div className="flex-gap" style={{ justifyContent: 'center' }}>
            <Link to="/" className="btn btn-primary">
              Return to Dashboard
            </Link>
            <button className="btn btn-outline" onClick={() => window.location.reload()}>
              <RotateCcw size={18} /> Retake
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-secondary mb-4">
        <ArrowLeft size={18} /> Exit Quiz
      </Link>

      <div className="flex-between mb-4">
        <span className="font-bold text-muted">Question {currentQ + 1} of {QUESTIONS.length}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {QUESTIONS.map((_, i) => (
            <div 
              key={i} 
              style={{ 
                width: '30px', 
                height: '6px', 
                background: i < currentQ ? 'var(--primary)' : i === currentQ ? 'var(--primary)' : 'var(--bg-card)',
                opacity: i === currentQ ? 1 : 0.5,
                borderRadius: '3px' 
              }} 
            />
          ))}
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-2xl font-bold mb-6">{q.question}</h2>

        <div className="grid grid-cols-1 mb-6" style={{ gridTemplateColumns: '1fr', gap: '0' }}>
          {q.options.map((opt, i) => {
            let className = "quiz-option";
            if (showResult) {
              if (i === q.correct) className += " correct";
              else if (i === selected) className += " incorrect";
            } else if (i === selected) {
              className += " selected";
            }

            return (
              <button 
                key={i}
                className={className}
                onClick={() => handleSelect(i)}
                disabled={showResult}
              >
                <div className="flex-between w-full">
                  <span>{opt}</span>
                  {showResult && i === q.correct && <CheckCircle size={18} color="var(--success)" />}
                  {showResult && i === selected && i !== q.correct && <XCircle size={18} color="var(--error)" />}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="card mb-6 animate-fade-in" style={{ 
            borderColor: selected === q.correct ? 'var(--success)' : 'var(--error)',
            background: selected === q.correct ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)' 
          }}>
            <h3 className="font-bold mb-2 flex-gap" style={{ color: selected === q.correct ? 'var(--success)' : 'var(--error)' }}>
              {selected === q.correct ? <CheckCircle /> : <XCircle />}
              {selected === q.correct ? 'Correct!' : 'Incorrect'}
            </h3>
            <p>{q.explanation}</p>
          </div>
        )}

        <div className="flex-between">
          <div /> {/* Spacer */}
          {!showResult ? (
            <button 
              className="btn btn-primary" 
              onClick={handleCheck}
              disabled={selected === null}
            >
              Check Answer
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
            >
              {currentQ < QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
