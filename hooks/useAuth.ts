import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UtilisateurService } from "../services/userService";
import { Utilisateur, LoginResponse } from "../interfaces/Utilisateur";

interface AuthState {
  token: string;
  utilisateur: Utilisateur;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState | null>(null);

  // Charger le token
  useEffect(() => {
    (async () => {
      const storedAuthState = await AsyncStorage.getItem("auth");
      if (storedAuthState) {
        setAuthState(JSON.parse(storedAuthState));
      }
    })();
  }, []);

  // Connexion
  const login = useCallback(async (email: string, mot_de_passe: string) => {
    const data: LoginResponse = await UtilisateurService.login(
      email,
      mot_de_passe
    );
    const newAuthState = {
      token: data.token,
      utilisateur: data.utilisateur,
    };
    await AsyncStorage.setItem("auth", JSON.stringify(newAuthState));
    setAuthState(newAuthState);
  }, []);

  // Déconnexion
  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("auth");
    setAuthState(null);
  }, []);

  // Mettre à jour l'utilisateur
  const updateUtilisateur = (nouvelUtilisateur: Utilisateur) => {
    if (!authState) return;
    const newAuth = { ...authState, utilisateur: nouvelUtilisateur };
    setAuthState(newAuth);
    AsyncStorage.setItem("auth", JSON.stringify(newAuth)); // 🔒 Update aussi dans le stockage local
  };

  // Vérifier la validité du token
  const checkToken = useCallback(async () => {
    const storedAuthState = await AsyncStorage.getItem("auth");

    if (!storedAuthState) {
      return false;
    }

    const authState = JSON.parse(storedAuthState) as AuthState;

    if (!authState?.token) {
      return false;
    }

    try {
      const response = await fetch(
        "http://192.168.1.14:3000/utilisateur/checkToken",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: authState.token }),
        }
      );
      if (response.status !== 200) {
        await logout();
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }, [logout]);

  const isAuthenticated = !!authState?.token;

  return {
    authState,
    isAuthenticated,
    login,
    logout,
    checkToken,
    updateUtilisateur,
  };
}
