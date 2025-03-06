import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { login as loginService } from "../services/userService";
import { Utilisateur, LoginResponse } from "../interfaces/Utilisateur";

interface AuthState {
  token: string;
  utilisateur: Utilisateur;
}

export function useAuth() {
  const [authState, setAuthState] = useLocalStorage<AuthState | null>(
    "auth",
    null
  );

  // Connexion
  const login = useCallback(
    async (email: string, mot_de_passe: string) => {
      const data: LoginResponse = await loginService(email, mot_de_passe);
      setAuthState({
        token: data.token,
        utilisateur: data.utilisateur,
      });
    },
    [setAuthState]
  );

  // Déconnexion
  const logout = useCallback(() => {
    setAuthState(null);
  }, [setAuthState]);

  // Vérifier la validité du token
  const checkToken = useCallback(async () => {
    const storedAuthState = localStorage.getItem("auth");
    if (!storedAuthState) {
      return false;
    }
    const authState = JSON.parse(storedAuthState) as AuthState;
    if (!authState?.token) {
      return false;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/utilisateur/checkToken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: authState.token }),
        }
      );

      if (response.status !== 200) {
        logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
      return false;
    }
  }, [authState, logout]);
  const isAuthenticated = !!authState?.token;

  return {
    authState,
    isAuthenticated,
    login,
    logout,
    checkToken,
  };
}
