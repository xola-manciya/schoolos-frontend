export interface FeatureFlag {
  id: number;
  key: string;
  name: string;
  description: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: number;
  updated_by_name?: string;
}
