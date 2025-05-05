import { LoginResponse } from "../interfaces/Utilisateur";

const API_URL = "http://localhost:3000";

export type InscriptionPayload = {
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
};

export type ModificationMotdepassePayload = {
  token: string;
  email: string;
  olderPassword: string;
  newPassword: string;
};

export type UpdatePayload = {
  nom: string;
  prenom: string;
  email: string;
};

export const UtilisateurService = {
  login: async (
    email: string,
    mot_de_passe: string
  ): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/utilisateur/connexion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, mot_de_passe }),
    });

    if (response.status === 401) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la connexion");
    }

    const data: LoginResponse = await response.json();
    return data;
  },

  supprimerUtilisateur: async (id: number, token: string) => {
    const response = await fetch(`${API_URL}/utilisateur/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erreur lors de la suppression.");
    }

    return await response.json();
  },

  inscrireUtilisateur: async (payload: InscriptionPayload) => {
    const response = await fetch(`${API_URL}/utilisateur`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Une erreur est survenue.");
    }

    return await response.json();
  },

  modifierMotdepasse: async ({
    token,
    email,
    olderPassword,
    newPassword,
  }: ModificationMotdepassePayload) => {
    const response = await fetch(`${API_URL}/utilisateur/motdepasseOublie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, olderPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors du changement de mot de passe."
      );
    }

    return await response.json();
  },

  getUtilisateurById: async (id: number, token: string) => {
    const response = await fetch(`${API_URL}/utilisateur/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors du chargement du profil.");
    }

    return await response.json();
  },

  updateUtilisateurProfil: async (
    id: number,
    token: string,
    payload: UpdatePayload
  ) => {
    const response = await fetch(`${API_URL}/utilisateur/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la mise à jour.");
    }

    return await response.json();
  },
};
