import { LoginResponse } from "../interfaces/Utilisateur";

export const login = async (
  email: string,
  mot_de_passe: string
): Promise<LoginResponse> => {
  const response = await fetch("http://localhost:3000/utilisateur/connexion", {
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
};
