export interface JournalEmotion {
  id: number;
  utilisateur_id: number;
  emotion_base_id: number;
  emotion_avance_id: number;
  date_enregistrement: string;
  commentaire: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmotionAvance {
  id: number;
  type_emotion: string;
  emotion_id: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmotionBase {
  id: number;
  type_emotion: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
