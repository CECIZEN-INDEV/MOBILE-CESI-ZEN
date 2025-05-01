import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";
import { useRouter, useLocalSearchParams } from "expo-router";
import { EmotionBase, EmotionAvance } from "../../interfaces/Emotion";
import BottomNavBar from "../../components/BottomNavBar";
import { EmotionService } from "../../services/emotionService";

const AddEmotionScreen: React.FC = () => {
  const { date } = useLocalSearchParams(); // Récupère la date sélectionnée
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
  const [commentaire, setCommentaire] = useState("");

  const { authState, isAuthenticated, checkToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) {
        const isValid = await checkToken();
        if (!isValid) {
          router.push("/utilisateur/connexion");
          return;
        }
      }

      try {
        const storedAuth = await AsyncStorage.getItem("auth");
        if (!storedAuth) return;
        const auth = JSON.parse(storedAuth);
        const baseEmotions = await EmotionService.getEmotionsBase(auth.token);
        setAllEmotionsBase(baseEmotions);
      } catch (error) {
        console.error("Erreur lors du chargement des émotions :", error);
      }
    })();
  }, [isAuthenticated, checkToken, router]);

  // Fonction pour sélectionner une émotion de base et charger ses émotions avancées
  const handleSelectBaseEmotion = async (selectedEmotion: EmotionBase) => {
    setEmotionBase(selectedEmotion);
    setShowBaseList(false);

    try {
      const storedAuth = await AsyncStorage.getItem("auth");
      if (!storedAuth) return;
      const auth = JSON.parse(storedAuth);
      const avanceEmotions = await EmotionService.getEmotionsAvanceByBaseId(
        selectedEmotion.id,
        auth.token
      );
      setAllEmotionsAvance(avanceEmotions);
      setEmotionAvance(null);
    } catch (error) {
      console.error("Erreur lors du chargement des émotions avancées :", error);
    }
  };

  // Fonction pour sélectionner une émotion avancée
  const handleSelectAvanceEmotion = (selectedEmotion: EmotionAvance) => {
    setEmotionAvance(selectedEmotion);
    setShowAvanceList(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const addEmotion = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem("auth");
      if (!storedAuth) return;
      const auth = JSON.parse(storedAuth);

      const selectedDate = date
        ? formatDate(date.toString())
        : new Date().toISOString();

      await EmotionService.addJournalEmotion(auth.token, {
        utilisateur_id: auth.utilisateur.id,
        emotion_base_id: emotionBase?.id,
        emotion_avance_id: emotionAvance?.id,
        commentaire,
        date_enregistrement: selectedDate,
      });

      alert("Journal ajouté avec succès !");
      router.push("/utilisateur/home");
    } catch (error: any) {
      if (error.message.includes("déjà été enregistrée")) {
        Alert.alert("Malheureusement...", error.message, [{ text: "OK" }]);
      } else {
        console.error("Erreur lors de l'ajout du journal :", error);
        alert("Erreur lors de l'ajout du journal.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>
          Cesi<Text style={styles.logoZen}>Zen</Text>
        </Text>

        <Text style={styles.date}>
          {date ? date.toString() : "Sélectionne une date"}
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
                onPress={() => handleSelectBaseEmotion(emotion)}
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
          value={commentaire}
          onChangeText={setCommentaire}
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={addEmotion}>
          <Text style={styles.saveButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default AddEmotionScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
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
    fontSize: 16,
  },
});
