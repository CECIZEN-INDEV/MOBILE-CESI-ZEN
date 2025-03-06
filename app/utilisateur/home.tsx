// app/home.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { authState, isAuthenticated, checkToken } = useAuth();

  useEffect(() => {
    // Au montage, on vérifie le token.
    (async () => {
      const isValid = await checkToken();
      console.log("Token valid:", isValid);
      if (!isValid) {
        // Token invalide => redirection vers /connexion
        router.push("/utilisateur/connexion");
      }
    })();
  }, [checkToken, router]);

  // Si on veut afficher un état de "chargement" le temps de la vérification :
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text>Vérification du token en cours...</Text>
      </View>
    );
  }

  // Sinon, on affiche la page Home
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accueil</Text>
      {authState && <Text>Bienvenue {authState.utilisateur.prenom} !</Text>}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});
