import type { WaveParams } from '../../wave/types';

export interface VinylProject {
  id: string;
  title: string;
  subtitle: string;
  coverGradient: string;
  spineColor: string;
  accentColor: string;
  coverImage?: string;
  year: string;
  description: string;
  tags: string[];
  links: { label: string; url: string }[];
  waveParams: WaveParams;
}

export type RecordState = 'resting' | 'hovered' | 'selected' | 'flipped';
