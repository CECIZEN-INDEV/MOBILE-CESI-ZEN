// app/home.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import useInformations from "../../components/Informations";
import BottomNavBar from "../../components/BottomNavBar";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { authState, isAuthenticated, checkToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const informations = useInformations();

  useEffect(() => {
    let isCheck = true;

    (async () => {
      if (!isAuthenticated) {
        const isValid = await checkToken();
        if (isCheck) {
          setLoading(false);
          if (!isValid) router.push("/utilisateur/connexion");
        }
      } else setLoading(false);
    })();

    return () => {
      isCheck = false;
    };
  }, []);

  if (loading || !authState) {
    return (
      <View style={styles.container}>
        <Text>Vérification du token en cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CesiZen</Text>
      <TouchableOpacity style={styles.emotionButton}>
        <Text style={styles.emotionText}>Que ressentez-vous aujourd'hui ?</Text>
      </TouchableOpacity>

      <Text style={styles.infoTitle}>Information du jour</Text>

      <ScrollView style={styles.scrollView}>
        {informations.map((info) => (
          <View key={info.id} style={styles.informationContainer}>
            <Text style={styles.informationTitle}>{info.titre}</Text>
            <Text style={styles.informationDescription}>{info.contenu}</Text>
            <Text style={styles.informationDate}>
              {new Date(info.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      <BottomNavBar />
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  emotionButton: {
    backgroundColor: "#B9E4C9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  emotionText: {
    fontSize: 16,
    color: "#4F7E5E",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#555",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    textAlign: "center",
    paddingBottom: 10,
    marginBottom: 10,
  },
  scrollView: {
    width: "100%",
  },
  informationContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  informationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  informationDescription: {
    fontSize: 14,
    color: "#777",
    marginVertical: 5,
  },
  informationDate: {
    fontSize: 12,
    color: "#999",
  },
});
