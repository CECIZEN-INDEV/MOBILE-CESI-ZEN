const API_URL = "http://192.168.1.14:3000";

export const EmotionService = {
  async getEmotionsBase(token: string) {
    const res = await fetch(`${API_URL}/emotions-base`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new Error("Erreur lors du chargement des émotions de base.");
    return await res.json();
  },

  async getEmotionsAvanceByBaseId(emotionBaseId: number, token: string) {
    const res = await fetch(
      `${API_URL}/emotions-avancees/emotion/${emotionBaseId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok)
      throw new Error("Erreur lors du chargement des émotions avancées.");
    return await res.json();
  },

  async addJournalEmotion(
    token: string,
    payload: {
      utilisateur_id: number;
      emotion_base_id?: number;
      emotion_avance_id?: number;
      commentaire: string;
      date_enregistrement: string;
    }
  ) {
    const res = await fetch(`${API_URL}/journal-emotion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 409) {
      throw new Error("Une émotion a déjà été enregistrée pour cette date.");
    }
    if (!res.ok) throw new Error("Erreur lors de l'ajout du journal.");
    return await res.json();
  },

  async getJournauxUtilisateur(userId: number, token: string) {
    const res = await fetch(`${API_URL}/journal-emotion/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new Error("Erreur lors de la récupération des journaux.");
    return await res.json();
  },

  async getJournalEmotionById(id: number, token: string) {
    const res = await fetch(`${API_URL}/journal-emotion/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors du chargement du journal.");
    return await res.json();
  },

  async getEmotionBaseById(id: number, token: string) {
    const res = await fetch(`${API_URL}/emotions-base/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new Error("Erreur lors du chargement de l'émotion de base.");
    return await res.json();
  },

  async getEmotionAvanceById(id: number, token: string) {
    const res = await fetch(`${API_URL}/emotions-avancees/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      throw new Error("Erreur lors du chargement de l'émotion avancée.");
    return await res.json();
  },

  async deleteJournalEmotion(id: number, token: string) {
    const res = await fetch(`${API_URL}/journal-emotion/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression.");
    return await res.json();
  },

  async updateJournalEmotion(
    id: number,
    token: string,
    payload: {
      commentaire: string;
      emotion_base_id?: number;
      emotion_avance_id?: number;
    }
  ) {
    const res = await fetch(`${API_URL}/journal-emotion/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erreur mise à jour journal");
    return await res.json();
  },
};
