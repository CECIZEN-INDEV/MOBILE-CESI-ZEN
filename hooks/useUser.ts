import { useAuth } from "./useAuth";
import { Utilisateur } from "../interfaces/Utilisateur";

export function useUser(): Utilisateur | null {
  const { authState } = useAuth();
  return authState?.utilisateur ?? null;
}
