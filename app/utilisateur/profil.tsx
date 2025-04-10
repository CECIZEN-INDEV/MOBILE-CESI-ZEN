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
import BottomNavBar from "../../components/BottomNavBar";
import { Ionicons } from "@expo/vector-icons";

const ProfilPage: React.FC = () => {
  const { authState, checkToken, isAuthenticated } = useAuth();
  const utilisateur = authState?.utilisateur;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCheck = true;

    (async () => {
      if (!isAuthenticated) {
        const isValid = await checkToken();
        if (isCheck) {
          setLoading(false);
          if (!isValid) {
            router.push("/utilisateur/connexion");
          }
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>CesiZen</Text>
        <Text style={styles.title}>Profil</Text>

        {utilisateur ? (
          <>
            <View style={styles.profileBoxContainer}>
              <View style={styles.box}>
                <Text style={styles.boxText}>{utilisateur.nom}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxText}>{utilisateur.prenom}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxText}>{utilisateur.email}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={() =>
                router.push({
                  pathname: "/utilisateur/profilUpdate",
                  params: { id: utilisateur.id },
                })
              }
            >
              <Ionicons name="create-outline" size={22} color="#fff" />
              <Text style={styles.updateText}>Modification Profil</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.info}>
            Aucune information utilisateur disponible.
          </Text>
        )}
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

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
  // Styles supplémentaires pour le profil
  profileBoxContainer: {
    width: "100%",
    alignItems: "center",
  },
  box: {
    width: "90%",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  boxText: {
    fontSize: 18,
    color: "#555",
  },
  info: {
    fontSize: 18,
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  updateButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  updateText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ProfilPage;
