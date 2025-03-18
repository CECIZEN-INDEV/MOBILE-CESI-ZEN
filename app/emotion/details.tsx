// emotion/details.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
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

  useEffect(() => {
    (async () => {
      const storedAuthState = await AsyncStorage.getItem("auth");
      if (!storedAuthState) {
        return false;
      }
      const authState = JSON.parse(storedAuthState) as AuthState;
      if (!authState?.token) {
        return false;
      }

      const resJournal = await fetch(
        `http://localhost:3000/journal-emotion/${id}`,
        {
          headers: { Authorization: `Bearer ${authState?.token}` },
        }
      );
      const dataJournal = await resJournal.json();
      console.log(dataJournal);
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

  if (!journal || !emotionBase || !emotionAvance)
    return <Text>Chargement...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {new Date(journal.date_enregistrement).toLocaleDateString()}
      </Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({ pathname: "/emotion/edit", params: { id: journal.id } })
        }
      >
        <Ionicons name="create-outline" size={28} />
      </TouchableOpacity>

      <Text style={styles.box}>{emotionBase.type_emotion}</Text>
      <Text style={styles.box}>{emotionAvance.type_emotion}</Text>
      <Text style={styles.comment}>{journal.commentaire}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  date: { fontSize: 20, textAlign: "center", marginBottom: 20 },
  editButton: { position: "absolute", top: 20, right: 20 },
  box: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginVertical: 8,
    textAlign: "center",
  },
  comment: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 15,
  },
});

export default DetailsScreen;
