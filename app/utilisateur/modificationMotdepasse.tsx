import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import BottomNavBar from "../../components/BottomNavBar";
import { UtilisateurService } from "../../services/userService";

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
    if (!olderPassword || !newPassword || !confirmPassword) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const storedAuth = await AsyncStorage.getItem("auth");
      if (!storedAuth) throw new Error("Aucun jeton trouvé.");

      const authData = JSON.parse(storedAuth);

      await UtilisateurService.modifierMotdepasse({
        token: authData.token,
        email: authData.utilisateur.email,
        olderPassword,
        newPassword,
      });

      Alert.alert("Succès", "Mot de passe modifié avec succès !");
      router.push("/utilisateur/profil");
    } catch (error: any) {
      console.error("Erreur modification mot de passe:", error);
      setErrorMessage(error.message || "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCheck = true;

    (async () => {
      if (!isAuthenticated) {
        const isValid = await checkToken();
        if (isCheck && !isValid) {
          router.push("/utilisateur/connexion");
        }
      }
    })();

    return () => {
      isCheck = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
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

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

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
      </KeyboardAvoidingView>
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
