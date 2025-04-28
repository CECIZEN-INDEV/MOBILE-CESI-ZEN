import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const InscriptionPage: React.FC = () => {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  // Fonction appelée lors du clic sur "S'inscrire"
  const handleInscription = async () => {
    // Vérification des champs obligatoires
    if (!nom || !prenom || !email || !motDePasse) {
      Alert.alert(
        "Erreur",
        "Veuillez renseigner tous les champs obligatoires."
      );
      return;
    }

    try {
      // Appel à l'API pour créer l'utilisateur
      const response = await fetch("http://localhost:3000/utilisateur", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          mot_de_passe: motDePasse,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Erreur", errorData.message || "Une erreur est survenue.");
        return;
      }

      Alert.alert("Succès", "Votre compte a été créé avec succès !");
      // Redirection vers la page de connexion
      router.push("/utilisateur/connexion");
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue pendant l'inscription.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>CesiZen</Text>
        <Text style={styles.title}>Inscription</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={prenom}
            onChangeText={setPrenom}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.btnInscription}
          onPress={handleInscription}
        >
          <Text style={styles.btnText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/utilisateur/connexion")}>
          <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InscriptionPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
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
  title: {
    fontSize: 22,
    color: "#333",
    marginVertical: 20,
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  btnInscription: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#4CAF50",
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
