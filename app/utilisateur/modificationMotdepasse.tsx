import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import BottomNavBar from "../../components/BottomNavBar";

const ModificationMotdepasse: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, checkToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [olderPassword, setOlderPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updatePassword = async () => {
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const storedAuth = await AsyncStorage.getItem("auth");
      if (!storedAuth) throw new Error("Aucun jeton trouvé.");
      const authData = JSON.parse(storedAuth);
      const res = await fetch(
        `http://localhost:3000/utilisateur/motdepasseOublie`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.token}`,
          },
          body: JSON.stringify({
            email: authData.utilisateur.email,
            olderPassword,
            newPassword,
          }),
        }
      );

      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(
          errorResponse.message || "Erreur lors du changement de mot de passe."
        );
      }

      Alert.alert("Succès", "Mot de passe modifié avec succès !");
      router.push("/utilisateur/profil");
    } catch (error: any) {
      console.error("Erreur modification mot de passe:", error);
      setErrorMessage(error.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>
          Cesi<Text style={styles.logoZen}>Zen</Text>
        </Text>
        <Text style={styles.title}>Modifier le mot de passe</Text>

        <Text style={styles.label}>Ancien mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Ancien mot de passe"
          value={olderPassword}
          onChangeText={setOlderPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Nouveau mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmer le nouveau mot de passe</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={updatePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Changer le mot de passe</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default ModificationMotdepasse;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginTop: 30,
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
