export interface CourseProgress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  downloads: string[];
  learningGaps: string[];
}

const DEFAULT_PROGRESS: CourseProgress = {
  completedLessons: [],
  quizScores: {},
  downloads: [],
  learningGaps: []
};

class Store {
  private listeners: (() => void)[] = [];
  
  private getProgress(): CourseProgress {
    const saved = localStorage.getItem('nexus_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROGRESS;
      }
    }
    return DEFAULT_PROGRESS;
  }

  private setProgress(progress: CourseProgress) {
    localStorage.setItem('nexus_progress', JSON.stringify(progress));
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Actions
  get state() {
    return this.getProgress();
  }

  markLessonComplete(lessonId: string) {
    const state = this.getProgress();
    if (!state.completedLessons.includes(lessonId)) {
      state.completedLessons.push(lessonId);
      this.setProgress(state);
    }
  }

  saveQuizScore(quizId: string, score: number, gapDetected?: string) {
    const state = this.getProgress();
    state.quizScores[quizId] = score;
    
    if (gapDetected && !state.learningGaps.includes(gapDetected)) {
      state.learningGaps.push(gapDetected);
    } else if (!gapDetected && state.learningGaps.includes(quizId)) {
      // Remove from gaps if they pass
      state.learningGaps = state.learningGaps.filter(g => g !== quizId);
    }
    
    this.setProgress(state);
  }

  markDownloaded(contentId: string) {
    const state = this.getProgress();
    if (!state.downloads.includes(contentId)) {
      state.downloads.push(contentId);
      this.setProgress(state);
    }
  }

  isDownloaded(contentId: string) {
    return this.getProgress().downloads.includes(contentId);
  }
}

export const store = new Store();

// Cache helper for media
export async function downloadMedia(url: string, contentId: string) {
  try {
    const cache = await caches.open('offline-media');
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response);
      store.markDownloaded(contentId);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Download failed", err);
    return false;
  }
}
