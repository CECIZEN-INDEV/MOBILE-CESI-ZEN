import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import BottomNavBar from "../../components/BottomNavBar";
import { UtilisateurService } from "../../services/userService";

const profilUpdate: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated, checkToken, updateUtilisateur } = useAuth();
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // Vérification de l'authentification
      if (!isAuthenticated) {
        const isValid = await checkToken();
        if (!isValid && isMounted) {
          router.push("/utilisateur/connexion");
          return;
        }
      }
      try {
        const storedAuth = await AsyncStorage.getItem("auth");
        if (!storedAuth)
          throw new Error("Aucun jeton d'authentification trouvé.");
        const authData = JSON.parse(storedAuth);
        if (!authData.token) throw new Error("Token invalide.");

        const data = await UtilisateurService.getUtilisateurById(
          Number(id),
          authData.token
        );
        if (isMounted) {
          setNom(data.nom);
          setPrenom(data.prenom);
          setEmail(data.email);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
        if (isMounted) setErrorMessage("Erreur lors du chargement du profil.");
      }
      if (isMounted) setLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [id, isAuthenticated, checkToken, router]);

  const updateProfile = async () => {
    if (!nom || !prenom || !email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      const storedAuth = await AsyncStorage.getItem("auth");
      if (!storedAuth) throw new Error("Aucun jeton trouvé.");
      const authData = JSON.parse(storedAuth);

      const updatedUser = await UtilisateurService.updateUtilisateurProfil(
        Number(id),
        authData.token,
        {
          nom,
          prenom,
          email,
        }
      );

      updateUtilisateur(updatedUser);

      alert("Profil mis à jour avec succès !");
      router.push("/utilisateur/profil");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      alert(error.message || "Erreur lors de la mise à jour du profil.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo */}
        <Text style={styles.logo}>
          Cesi<Text style={styles.logoZen}>Zen</Text>
        </Text>
        <Text style={styles.title}>Modifier Profil</Text>

        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre nom"
          value={nom}
          onChangeText={setNom}
        />

        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre prénom"
          value={prenom}
          onChangeText={setPrenom}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
          <Text style={styles.saveButtonText}>Mettre à jour</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default profilUpdate;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  logoZen: {
    color: "#4CAF50",
  },
  title: {
    fontSize: 22,
    color: "#333",
    marginVertical: 20,
    fontWeight: "600",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 10,
    fontSize: 16,
  },
});
