import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";
import BottomNavBar from "../../components/BottomNavBar";
import { EmotionService } from "../../services/emotionService";
import { AuthState } from "../../interfaces/AuthState";
import {
  JournalEmotion,
  EmotionBase,
  EmotionAvance,
} from "../../interfaces/Emotion";

const EditEmotionScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [journal, setJournal] = useState<JournalEmotion | null>(null);
  const [emotionBase, setEmotionBase] = useState<EmotionBase | null>(null);
  const [emotionAvance, setEmotionAvance] = useState<EmotionAvance | null>(
    null
  );
  const [allEmotionsBase, setAllEmotionsBase] = useState<EmotionBase[]>([]);
  const [allEmotionsAvance, setAllEmotionsAvance] = useState<EmotionAvance[]>(
    []
  );
  const [showBaseList, setShowBaseList] = useState(false);
  const [showAvanceList, setShowAvanceList] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, checkToken } = useAuth();

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      const storedAuthState = await AsyncStorage.getItem("auth");
      if (!storedAuthState) return;

      const authState = JSON.parse(storedAuthState) as AuthState;
      const token = authState.token;

      try {
        // Vérification token + journal
        const journalData = await EmotionService.getJournalEmotionById(
          Number(id),
          token
        );
        if (!isActive) return;
        setJournal(journalData);

        const emotionsBaseList = await EmotionService.getEmotionsBase(token);
        if (!isActive) return;
        setAllEmotionsBase(emotionsBaseList);

        if (journalData.emotion_base_id) {
          const selected = emotionsBaseList.find(
            (e: { id: any }) => e.id === journalData.emotion_base_id
          );
          if (selected) await handleSelectBaseEmotion(selected, token);

          const emotionAvanceData = await EmotionService.getEmotionAvanceById(
            journalData.emotion_avance_id,
            token
          );
          setEmotionAvance(emotionAvanceData);
        }

        const selected = journalData.emotion_base_id
          ? emotionsBaseList.find(
              (e: { id: any }) => e.id === journalData.emotion_base_id
            )
          : null;
        setEmotionBase(selected);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    const verifyAndFetch = async () => {
      if (!isAuthenticated) {
        const valid = await checkToken();
        if (!valid) {
          router.push("/utilisateur/connexion");
          return;
        }
      }
      fetchData();
    };

    verifyAndFetch();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleSelectBaseEmotion = async (
    emotion: EmotionBase,
    token: string
  ) => {
    setEmotionBase(emotion);
    setShowBaseList(false);
    try {
      const avances = await EmotionService.getEmotionsAvanceByBaseId(
        emotion.id,
        token
      );
      setAllEmotionsAvance(avances);
      setEmotionAvance(null);
    } catch (error) {
      console.error("Erreur chargement émotions avancées :", error);
    }
  };

  const handleSelectAvanceEmotion = (emotion: EmotionAvance) => {
    setEmotionAvance(emotion);
    setShowAvanceList(false);
  };

  const updateJournalEmotion = async () => {
    try {
      const storedAuthState = await AsyncStorage.getItem("auth");
      if (!storedAuthState) return;

      const authState = JSON.parse(storedAuthState) as AuthState;
      const token = authState.token;

      await EmotionService.updateJournalEmotion(Number(id), token, {
        commentaire: journal?.commentaire || "",
        emotion_base_id: emotionBase?.id,
        emotion_avance_id: emotionAvance?.id,
      });

      alert("Journal mis à jour avec succès !");
      router.push("/utilisateur/home");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du journal :", error);
      alert("Erreur lors de la mise à jour du journal.");
    }
  };

  if (loading || !journal) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>
          Cesi<Text style={styles.logoZen}>Zen</Text>
        </Text>

        <Text style={styles.date}>
          {new Date(journal.date_enregistrement).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>

        <Text style={styles.label}>Émotion de base</Text>
        <TouchableOpacity
          style={styles.box}
          onPress={() => setShowBaseList(!showBaseList)}
        >
          <Text>
            {emotionBase ? emotionBase.type_emotion : "Choisir une émotion"}
          </Text>
        </TouchableOpacity>

        {showBaseList && (
          <View style={styles.dropdown}>
            {allEmotionsBase.map((emotion) => (
              <TouchableOpacity
                key={emotion.id}
                style={styles.dropdownItem}
                onPress={async () => {
                  const storedAuthState = await AsyncStorage.getItem("auth");
                  if (!storedAuthState) return;
                  const token = JSON.parse(storedAuthState).token;
                  await handleSelectBaseEmotion(emotion, token);
                }}
              >
                <Text>{emotion.type_emotion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Émotion avancée</Text>
        <TouchableOpacity
          style={styles.box}
          onPress={() =>
            allEmotionsAvance.length > 0 && setShowAvanceList(!showAvanceList)
          }
          disabled={allEmotionsAvance.length === 0}
        >
          <Text>
            {emotionAvance
              ? emotionAvance.type_emotion
              : "Choisir une émotion avancée"}
          </Text>
        </TouchableOpacity>

        {showAvanceList && (
          <View style={styles.dropdown}>
            {allEmotionsAvance.map((emotion) => (
              <TouchableOpacity
                key={emotion.id}
                style={styles.dropdownItem}
                onPress={() => handleSelectAvanceEmotion(emotion)}
              >
                <Text>{emotion.type_emotion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Commentaire</Text>
        <TextInput
          style={styles.comment}
          value={journal.commentaire}
          onChangeText={(text) =>
            setJournal((prev) => (prev ? { ...prev, commentaire: text } : null))
          }
          multiline
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={updateJournalEmotion}
        >
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default EditEmotionScreen;

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
  },
  comment: {
    width: "100%",
    padding: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: "#f9f9f9",
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
