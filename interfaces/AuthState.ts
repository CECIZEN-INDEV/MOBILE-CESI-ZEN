import { Utilisateur } from "../interfaces/Utilisateur";

export interface AuthState {
  token: string;
  utilisateur: Utilisateur;
}
