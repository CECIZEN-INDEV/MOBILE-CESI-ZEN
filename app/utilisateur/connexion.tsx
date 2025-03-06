import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

const Connexion: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [motDePasse, setMotDePasse] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/utilisateur/home");
    }
  }, [isAuthenticated]);

  function checkInput(email: string, motDePasse: string): boolean {
    if (!email || !motDePasse) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Veuillez entrer un email valide.");
      return false;
    }
    if (!email) {
      setError("Veuillez entrer un email.");
      return false;
    }
    if (!motDePasse) {
      setError("Veuillez entrer un mot de passe.");
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!checkInput(email, motDePasse)) {
      return;
    }
    try {
      await login(email, motDePasse);
      console.log("Login success, redirecting…");
      router.push("/utilisateur/home");
    } catch (err: any) {
      setError(err.message);
      Alert.alert("Erreur", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Se connecter" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
});

export default Connexion;
