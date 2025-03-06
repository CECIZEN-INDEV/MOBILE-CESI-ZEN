export interface Role {
  id: number;
  nom_role: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role_id: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  role: Role;
}

export interface LoginResponse {
  utilisateur: Utilisateur;
  token: string;
}
