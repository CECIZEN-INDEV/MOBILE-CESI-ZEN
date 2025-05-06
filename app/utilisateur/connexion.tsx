import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import BottomNavBar from "../../components/BottomNavBar";

const Connexion: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [motDePasse, setMotDePasse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { login, checkToken, isAuthenticated } = useAuth();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const isValid = isAuthenticated || (await checkToken());
      if (isMounted) {
        setLoading(false);
        if (isValid) router.push("/utilisateur/home");
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const checkInput = (): boolean => {
    if (!email || !motDePasse) {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    if (email.trim() === "" || motDePasse.trim() === "") {
      setError("Veuillez remplir tous les champs.");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("Veuillez entrer un email valide.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!checkInput()) return;

    try {
      await login(email, motDePasse);
      router.push("/utilisateur/home");
    } catch (err: any) {
      setError(err.message);
      Alert.alert("Erreur", err.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Chargement...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../../assets/cesizen.png")} style={styles.logo} />

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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Connexion</Text>
      </TouchableOpacity>

      <View style={styles.register}>
        <Text>Vous n'avez pas de compte ?</Text>
        <TouchableOpacity
          onPress={() => router.push("/utilisateur/inscription")}
        >
          <Text style={styles.link}>Inscription</Text>
        </TouchableOpacity>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  logo: {
    width: 260,
    height: 260,
    resizeMode: "contain",
    marginBottom: 40,
  },
  input: {
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
  },
  button: {
    backgroundColor: "#4CAF50",
    width: "50%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  link: {
    color: "#000",
    textDecorationLine: "underline",
    marginTop: 10,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  register: {
    marginTop: 40,
    alignItems: "center",
  },
});

export default Connexion;
