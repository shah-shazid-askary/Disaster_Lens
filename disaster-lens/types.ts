export interface AnalysisItem {
  scene_summary: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  hazards: string[];
  rescue_priority: 'Low' | 'Medium' | 'High' | 'Critical';
  safety_steps: string[];
  recommended_resources: string[];
}

export interface AnalysisResponse {
  results: AnalysisItem[];
}

export type DisasterType = 'General' | 'Flood' | 'Cyclone' | 'Fire' | 'Earthquake' | 'Building Collapse';

export interface ImageUpload {
  id: string;
  file: File;
  previewUrl: string;
}
