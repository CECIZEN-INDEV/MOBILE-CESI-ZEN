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
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "../../interfaces/AuthState";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import {
  JournalEmotion,
  EmotionBase,
  EmotionAvance,
} from "../../interfaces/Emotion";

const EditEmotionScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
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
  const { authState, isAuthenticated, checkToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isCheck = true;

    (async () => {
      if (!isAuthenticated) {
        const isValid = await checkToken();
        if (isCheck) {
          setLoading(false);
          if (!isValid) {
            router.push("/utilisateur/connexion");
            return;
          }
        }
      } else {
        setLoading(false);
      }

      try {
        const storedAuthState = await AsyncStorage.getItem("auth");
        if (!storedAuthState) return;

        const authState = JSON.parse(storedAuthState) as AuthState;
        if (!authState?.token) return;

        // Récupération du journal
        const resJournal = await fetch(
          `http://localhost:3000/journal-emotion/${id}`,
          {
            headers: { Authorization: `Bearer ${authState.token}` },
          }
        );
        if (!resJournal.ok) throw new Error("Failed to fetch journal");
        const dataJournal = await resJournal.json();
        setJournal(dataJournal);

        // Récupération des émotions de base
        const resAllBase = await fetch(`http://localhost:3000/emotions-base`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        if (!resAllBase.ok) throw new Error("Failed to fetch base emotions");
        const allBase = await resAllBase.json();
        setAllEmotionsBase(allBase);

        // Sélection de l'émotion de base et chargement de ses émotions avancées
        if (dataJournal.emotion_base_id) {
          const selectedBaseEmotion = allBase.find(
            (e: { id: any }) => e.id === dataJournal.emotion_base_id
          );
          if (selectedBaseEmotion) {
            await handleSelectBaseEmotion(selectedBaseEmotion);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des émotions :", error);
      }
    })();

    return () => {
      isCheck = false;
    };
  }, [id, isAuthenticated, checkToken, router]);

  const updateJournalEmotion = async () => {
    try {
      const storedAuthState = await AsyncStorage.getItem("auth");
      if (!storedAuthState) return;

      const authState = JSON.parse(storedAuthState) as AuthState;
      const res = await fetch(`http://localhost:3000/journal-emotion/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          commentaire: journal?.commentaire,
          emotion_base_id: emotionBase?.id,
          emotion_avance_id: emotionAvance?.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to update journal emotion");
      alert("Journal mis à jour avec succès !");
      router.push("/utilisateur/home");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du journal :", error);
      alert("Erreur lors de la mise à jour du journal.");
    }
  };

  // Fonction pour sélectionner une émotion de base et charger ses émotions avancées
  const handleSelectBaseEmotion = async (selectedEmotion: EmotionBase) => {
    setEmotionBase(selectedEmotion);
    setShowBaseList(false);

    try {
      const storedAuthState = await AsyncStorage.getItem("auth");
      if (!storedAuthState) return;

      const authState = JSON.parse(storedAuthState) as AuthState;
      const resAvance = await fetch(
        `http://localhost:3000/emotions-avancees/emotion/${selectedEmotion.id}`,
        {
          headers: { Authorization: `Bearer ${authState?.token}` },
        }
      );

      const allAvance = await resAvance.json();
      setAllEmotionsAvance(allAvance);
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

  if (!journal) {
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
        {/* Logo */}
        <Text style={styles.logo}>
          Cesi<Text style={styles.logoZen}>Zen</Text>
        </Text>

        {/* Date du journal */}
        <Text style={styles.date}>
          {new Date(journal.date_enregistrement).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>

        {/* Émotion de base */}
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

        {/* Émotion avancée */}
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

        {/* Commentaire */}
        <Text style={styles.label}>Commentaire</Text>
        <TextInput
          style={styles.comment}
          value={journal.commentaire}
          onChangeText={(text) =>
            setJournal((prev) => (prev ? { ...prev, commentaire: text } : null))
          }
          multiline
        />

        {/* Bouton d'enregistrement */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={updateJournalEmotion}
        >
          <Text style={styles.saveButtonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
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
