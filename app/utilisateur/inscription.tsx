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
import { UtilisateurService } from "../../services/userService";

const InscriptionPage: React.FC = () => {
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const handleInscription = async () => {
    if (!nom || !prenom || !email || !motDePasse) {
      Alert.alert(
        "Erreur",
        "Veuillez renseigner tous les champs obligatoires."
      );
      return;
    }

    try {
      await UtilisateurService.inscrireUtilisateur({
        nom,
        prenom,
        email,
        mot_de_passe: motDePasse,
      });

      Alert.alert("Succès", "Votre compte a été créé avec succès !");
      router.push("/utilisateur/connexion");
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
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
