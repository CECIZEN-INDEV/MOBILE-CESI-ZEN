import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

const Connexion: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [motDePasse, setMotDePasse] = useState<string>("");
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { login, checkToken, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCheck = true;

    (async () => {
      if (!isAuthenticated) {
        const isValid = await checkToken();
        if (isCheck) {
          setLoading(false);
          if (isValid) router.push("/utilisateur/home");
        }
      } else {
        setLoading(false);
        router.push("/utilisateur/home");
      }
    })();

    return () => {
      isCheck = false;
    };
  }, []);

  const checkInput = (): boolean => {
    if (!email || !motDePasse) {
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

  if (loading) return <Text>Chargement...</Text>;

  return (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => router.push("/inscription")}>
          <Text style={styles.link}>Inscription</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  inputContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
  },
  button: {
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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
  },
});

export default Connexion;
