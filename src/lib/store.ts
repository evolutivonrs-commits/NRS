import { useCallback } from "react";
import { Notebook, Content, ReviewRating } from "./types";
import { calculateSM2, getInitialSM2State } from "./sm2";

const KEY_PREFIX = "lexispulse_";

export const getStoredData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const data = localStorage.getItem(KEY_PREFIX + key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return defaultValue;
  }
};

export const setStoredData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    // Silently handle storage errors
  }
};

export const useStore = () => {
  const getNotebooks = useCallback(() => getStoredData<Notebook[]>('notebooks', []), []);
  const getContents = useCallback(() => getStoredData<Content[]>('contents', []), []);
  
  const isPending = useCallback((nextReviewDate: string | undefined, referenceDate: Date) => {
    if (!nextReviewDate) return true;
    const reviewDate = new Date(nextReviewDate);
    const ref = new Date(referenceDate);
    
    // Comparação normalizada por dia (ignorando horas/minutos)
    const d1 = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate());
    const d2 = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
    
    return d1 <= d2;
  }, []);

  const getStats = useCallback(() => {
    const contents = getContents();
    const notebooks = getNotebooks();
    const dominated = contents.filter(c => (c.sm2?.efactor || 0) > 2.8).length;
    const preferences = getStoredData('preferences', { dailyGoal: 20 });
    
    return {
      totalStudyTime: 120,
      dailyStreak: 3,
      retentionRate: contents.length > 0 ? Math.round((dominated / contents.length) * 100) : 0,
      totalContents: contents.length,
      dominatedContents: dominated,
      notebooksCount: notebooks.length,
      dailyGoal: preferences.dailyGoal
    };
  }, [getContents, getNotebooks]);

  const updateNotebookContentCount = useCallback((notebookId: string, delta: number) => {
    const nbs = getStoredData<Notebook[]>('notebooks', []);
    const updated = nbs.map(nb => 
      nb.id === notebookId ? { ...nb, contentCount: Math.max(0, (nb.contentCount || 0) + delta) } : nb
    );
    setStoredData('notebooks', updated);
  }, []);

  const saveNotebook = useCallback((nb: Notebook) => {
    const nbs = getStoredData<Notebook[]>('notebooks', []);
    const existingIdx = nbs.findIndex(n => n.id === nb.id);
    if (existingIdx > -1) {
      const updated = [...nbs];
      updated[existingIdx] = { ...updated[existingIdx], ...nb };
      setStoredData('notebooks', updated);
    } else {
      setStoredData('notebooks', [...nbs, nb]);
    }
  }, []);

  const deleteNotebook = useCallback((id: string) => {
    const nbs = getStoredData<Notebook[]>('notebooks', []).filter(n => n.id !== id);
    const contents = getStoredData<Content[]>('contents', []).filter(c => c.notebookId !== id);
    setStoredData('notebooks', nbs);
    setStoredData('contents', contents);
  }, []);

  const saveContent = useCallback((c: Partial<Content> & { id: string; notebookId: string; title: string }) => {
    const contents = getStoredData<Content[]>('contents', []);
    const existingIdx = contents.findIndex(item => item.id === c.id);
    
    const mediaDefaults = { videos: [], images: [], pdfs: [], audios: [] };
    const mergedMedia = { ...mediaDefaults, ...(c.media || {}) };
    
    if (existingIdx > -1) {
      const updated = [...contents];
      updated[existingIdx] = { 
        ...updated[existingIdx], 
        ...c,
        media: mergedMedia
      };
      setStoredData('contents', updated);
    } else {
      const newContent: Content = {
        id: c.id,
        notebookId: c.notebookId,
        title: c.title,
        summary: c.summary || "",
        notes: c.notes || "",
        tags: c.tags || [],
        links: c.links || [],
        media: mergedMedia,
        sm2: getInitialSM2State(),
        lastStudyDate: new Date().toISOString(),
        nextReviewDate: new Date().toISOString(),
      };
      setStoredData('contents', [...contents, newContent]);
      updateNotebookContentCount(c.notebookId, 1);
    }
  }, [updateNotebookContentCount]);

  const deleteContent = useCallback((id: string) => {
    const contents = getStoredData<Content[]>('contents', []);
    const item = contents.find(c => c.id === id);
    if (item) {
      setStoredData('contents', contents.filter(c => c.id !== id));
      updateNotebookContentCount(item.notebookId, -1);
    }
  }, [updateNotebookContentCount]);

  const updateContentReview = useCallback((contentId: string, rating: ReviewRating) => {
    const contents = getStoredData<Content[]>('contents', []);
    const updated = contents.map(c => {
      if (c.id === contentId) {
        const nextState = calculateSM2(rating, c.sm2 || getInitialSM2State());
        const nextReview = new Date();
        // SM-2 Intervalo é em dias
        nextReview.setDate(nextReview.getDate() + (nextState.interval || 1));
        
        return {
          ...c,
          sm2: nextState,
          lastStudyDate: new Date().toISOString(),
          nextReviewDate: nextReview.toISOString()
        };
      }
      return c;
    });
    setStoredData('contents', updated);
  }, []);

  const getNotebookById = useCallback((id: string) => {
    return getStoredData<Notebook[]>('notebooks', []).find(n => n.id === id);
  }, []);

  const getContentsByNotebook = useCallback((notebookId: string) => {
    return getStoredData<Content[]>('contents', []).filter(c => c.notebookId === notebookId);
  }, []);

  const getPendingReviews = useCallback((referenceDate: Date = new Date()) => {
    const contents = getStoredData<Content[]>('contents', []);
    return contents.filter(c => {
      if (!c.nextReviewDate) return true;
      const reviewDate = new Date(c.nextReviewDate);
      const ref = new Date(referenceDate);
      const d1 = new Date(reviewDate.getFullYear(), reviewDate.getMonth(), reviewDate.getDate());
      const d2 = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
      return d1 <= d2;
    });
  }, []);

  return {
    getNotebooks,
    getNotebookById,
    getContents,
    getStats,
    isPending,
    saveNotebook,
    deleteNotebook,
    getContentsByNotebook,
    saveContent,
    deleteContent,
    updateContentReview,
    getPendingReviews
  };
};
