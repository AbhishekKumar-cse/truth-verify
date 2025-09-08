import type { Timestamp } from 'firebase/firestore';

export interface Report {
  id: string;
  userId: string;
  claimTitle: string;
  claimStatement: string;
  claimCategory: string;
  claimSourceUrl?: string;
  truthScore: number;
  verdict: string;
  explanation: string;
  sources: {
    title: string;
    url: string;
  }[];
  createdAt: Timestamp | { seconds: number, nanoseconds: number };
}
