export interface EmotionRecord {
  id: number;
  date_enregistrement: string;
  commentaire: string;
  emotion_base?: {
    type_emotion: string;
  };
  emotion_avance?: {
    type_emotion: string;
  };
}

export interface EmotionReport {
  data: EmotionRecord[];
  average: Record<string, number>;
}
