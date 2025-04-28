// app/home.tsx (ou le chemin équivalent)
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      } else {
        setLoading(false);
      }
    })();

    return () => {
      isCheck = false;
    };
  }, []);

  if (loading || !authState) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Vérification du token en cours...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>CesiZen</Text>

        <TouchableOpacity
          style={styles.emotionButton}
          onPress={() => router.push("/emotion/add")}
        >
          <Text style={styles.emotionText}>
            Que ressentez-vous aujourd'hui ?
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>Information du jour</Text>

        <ScrollView style={styles.scrollView}>
          {informations.map((info) => (
            <TouchableOpacity
              key={info.id}
              style={styles.informationContainer}
              onPress={() =>
                router.push({
                  pathname: "/information/details",
                  params: { id: info.id.toString() },
                })
              }
            >
              <Text style={styles.informationTitle}>{info.titre}</Text>
              <Text style={styles.informationDescription}>{info.contenu}</Text>
              <Text style={styles.informationDate}>
                {new Date(info.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
};

export default HomePage;

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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4CAF50",
    marginVertical: 20,
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
  periodContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  periodButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  periodButtonActive: {
    backgroundColor: "#4CAF50",
  },
  periodButtonText: {
    fontSize: 16,
    color: "#4CAF50",
  },
  periodButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  exportButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  emotionButton: {
    backgroundColor: "#4CAF50",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  emotionText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  scrollView: {
    width: "100%",
    maxHeight: "60%",
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
