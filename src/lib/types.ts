export interface Notebook {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  contentCount: number;
}

export type ReviewRating = 'forgot' | 'partial' | 'remembered';

export interface SM2State {
  interval: number; // days
  repetition: number;
  efactor: number;
}

export interface Content {
  id: string;
  notebookId: string;
  title: string;
  summary: string;
  notes: string;
  tags: string[];
  lastStudyDate: string;
  links: string[];
  media: {
    videos: string[];
    images: string[];
    pdfs: string[];
    audios: string[];
  };
  sm2: SM2State;
  nextReviewDate: string;
}

export interface ReviewHistory {
  id: string;
  contentId: string;
  date: string;
  rating: ReviewRating;
}

export interface UserStats {
  totalStudyTime: number; // minutes
  dailyStreak: number;
  retentionRate: number;
  totalContents: number;
  dominatedContents: number;
}
