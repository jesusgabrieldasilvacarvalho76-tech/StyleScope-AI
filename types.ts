
export type View = 'home' | 'upload' | 'analysis' | 'history' | 'profile';

export interface HaircutRecommendation {
  name: string;
  lengths: string[];
  description: string;
  reason: string;
  styling: string;
}

export interface FacialAnalysis {
  faceShape: string;
  facialProportions: string;
  jawline: string;
  forehead: string;
  sideProfile: string;
  hairType: string;
  skinTone: string;
}

export interface AnalysisResult {
  analysis: FacialAnalysis;
  recommendations: HaircutRecommendation[];
}

export interface AnalysisRecord {
  id: string;
  date: string;
  frontalPhoto: string; // base64 string
  sidePhoto: string; // base64 string
  result: AnalysisResult;
}