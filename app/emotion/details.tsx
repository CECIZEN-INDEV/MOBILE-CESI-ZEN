import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import BottomNavBar from "../../components/BottomNavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AuthState } from "../../interfaces/AuthState";
import {
  JournalEmotion,
  EmotionBase,
  EmotionAvance,
} from "../../interfaces/Emotion";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailsScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [journal, setJournal] = useState<JournalEmotion | null>(null);
  const [emotionBase, setEmotionBase] = useState<EmotionBase | null>(null);
  const [emotionAvance, setEmotionAvance] = useState<EmotionAvance | null>(
    null
  );

  const DeleteJournalEmotion = async (id: number) => {
    const storedAuthState = await AsyncStorage.getItem("auth");
    if (!storedAuthState) return;
    const authState = JSON.parse(storedAuthState) as AuthState;

    try {
      await fetch(`http://localhost:3000/journal-emotion/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authState?.token}` },
      });
      Alert.alert("Succès", "L'entrée a bien été supprimée.");
      router.push("/utilisateur/home");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "La suppression a échoué.");
    }
  };

  useEffect(() => {
    (async () => {
      const storedAuthState = await AsyncStorage.getItem("auth");
      if (!storedAuthState) return false;
      const authState = JSON.parse(storedAuthState) as AuthState;
      if (!authState?.token) return false;

      const resJournal = await fetch(
        `http://localhost:3000/journal-emotion/${id}`,
        {
          headers: { Authorization: `Bearer ${authState?.token}` },
        }
      );
      const dataJournal = await resJournal.json();
      if (!dataJournal) {
        router.push("/utilisateur/home");
        return;
      }
      setJournal(dataJournal);

      const [resBase, resAvance] = await Promise.all([
        fetch(
          `http://localhost:3000/emotions-base/${dataJournal.emotion_base_id}`,
          {
            headers: { Authorization: `Bearer ${authState?.token}` },
          }
        ),
        fetch(
          `http://localhost:3000/emotions-avancees/${dataJournal.emotion_avance_id}`,
          {
            headers: { Authorization: `Bearer ${authState?.token}` },
          }
        ),
      ]);

      setEmotionBase(await resBase.json());
      setEmotionAvance(await resAvance.json());
    })();
  }, []);

  if (!journal || !emotionBase || !emotionAvance) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = new Date(
    journal.date_enregistrement
  ).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <Text style={styles.logo}>
          Cesi<Text style={styles.logoZen}>Zen</Text>
        </Text>

        {/* Date du journal */}
        <Text style={styles.date}>{formattedDate}</Text>

        {/* Bouton d'édition */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: "/emotion/edit",
              params: { id: journal.id },
            })
          }
        >
          <Ionicons name="create-outline" size={32} />
        </TouchableOpacity>

        {/* Détails de l'émotion */}
        <Text style={styles.label}>Émotion de base</Text>
        <Text style={styles.box}>{emotionBase.type_emotion}</Text>

        <Text style={styles.label}>Émotion avancée</Text>
        <Text style={styles.box}>{emotionAvance.type_emotion}</Text>

        <Text style={styles.label}>Commentaire</Text>
        <Text style={styles.comment}>{journal.commentaire}</Text>

        {/* Bouton de suppression (en rouge) */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert(
              "Confirmer",
              "Voulez-vous vraiment supprimer cette entrée ?",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Oui",
                  onPress: () => DeleteJournalEmotion(Number(id)),
                },
              ]
            )
          }
        >
          <Ionicons name="trash-outline" size={22} color="#fff" />
          <Text style={styles.deleteText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default DetailsScreen;

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
  editButton: {
    position: "absolute",
    top: 40,
    right: 20,
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
