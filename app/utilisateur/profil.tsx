import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import BottomNavBar from "../../components/BottomNavBar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "../../interfaces/AuthState";
import { UtilisateurService } from "../../services/userService";

const ProfilPage: React.FC = () => {
  const { authState, checkToken, isAuthenticated } = useAuth();
  const utilisateur = authState?.utilisateur;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const storedAuthState = AsyncStorage.getItem("auth");

  const DeleteUser = async (id: number) => {
    try {
      const storedAuthState = await AsyncStorage.getItem("auth");
      if (!storedAuthState) throw new Error("Aucun token trouvé.");

      const authState = JSON.parse(storedAuthState) as AuthState;

      await UtilisateurService.supprimerUtilisateur(id, authState.token);

      Alert.alert("Succès", "Votre compte a bien été supprimé.");
      await AsyncStorage.removeItem("auth");
      router.push("/utilisateur/connexion");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erreur", error.message || "La suppression a échoué.");
    }
  };

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
          <ActivityIndicator size="large" color="#4CAF50" />
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
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() =>
                router.push({
                  pathname: "/utilisateur/modificationMotdepasse",
                  params: { id: utilisateur.id },
                })
              }
            >
              <Ionicons name="lock-closed-outline" size={22} color="#fff" />
              <Text style={styles.updateText}>Modification MDP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                Alert.alert(
                  "Confirmer",
                  "Voulez-vous vraiment supprimer votre compte ?",
                  [
                    { text: "Annuler", style: "cancel" },
                    {
                      text: "Oui",
                      onPress: () => DeleteUser(Number(utilisateur.id)),
                    },
                  ]
                )
              }
            >
              <Ionicons name="trash-outline" size={22} color="#fff" />
              <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={async () => {
                await AsyncStorage.removeItem("auth");
                router.push("/utilisateur/home");
              }}
            >
              <Ionicons name="log-out-outline" size={22} color="#fff" />
              <Text style={styles.deleteText}>Déconnexion</Text>
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
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#E57373",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default ProfilPage;
