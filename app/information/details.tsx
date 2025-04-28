import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { InformationsType } from "../../interfaces/Information";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavBar from "../../components/BottomNavBar";
import { AuthState } from "../../interfaces/AuthState";

const DetailsInformation: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [information, setInformation] = useState<InformationsType | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:3000/information/${id}`, {});

      const data = await res.json();
      if (!data) {
        router.push("/utilisateur/home");
        return;
      }

      setInformation(data);
    })();
  }, []);

  if (!information) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(information.created_at).toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>
          Cesi<Text style={styles.logoZen}>Zen</Text>
        </Text>

        <Text style={styles.date}>{formattedDate}</Text>

        <Text style={styles.label}>Titre</Text>
        <Text style={styles.box}>{information.titre}</Text>

        <Text style={styles.label}>Contenu</Text>
        <Text style={styles.comment}>{information.contenu}</Text>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default DetailsInformation;

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
  date: {
    fontSize: 20,
    color: "#333",
    marginVertical: 10,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: "#333",
  },
  box: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    textAlign: "center",
    color: "#333",
    fontSize: 18,
  },
  comment: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
  },
});
