export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  author: Author;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number; // in minutes
  imageUrl: string;
  content: ContentBlock[];
  isPremium: boolean;
  views: number;
}

export type ContentBlock = 
  | { type: 'paragraph'; content: string }
  | { type: 'heading'; content: string }
  | { type: 'quote'; content: string; source?: string }
  | { type: 'image'; url: string; caption?: string; alt: string }
  | { type: 'stats'; title: string; value: string; desc: string };

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  socials: { twitter?: string; linkedin?: string };
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
  approved: boolean;
}

export interface SiteConfig {
  language: 'en' | 'es' | 'fr' | 'hi';
  maintenanceMode: boolean;
}

export enum PageState {
  HOME,
  CATEGORY,
  ARTICLE,
  ADMIN,
  LOGIN,
  DONATE,
  ABOUT
}