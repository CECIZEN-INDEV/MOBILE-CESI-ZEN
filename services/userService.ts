// services/userService.ts
import { LoginResponse } from "../interfaces/Utilisateur"; // Ajustez le chemin si besoin

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

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response data:", errorData);
    throw new Error(errorData.message || "Erreur lors de la connexion");
  }

  const data: LoginResponse = await response.json();
  console.log("Response data:", data);

  return data;
};
