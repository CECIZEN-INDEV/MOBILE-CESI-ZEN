import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { JournalEmotion } from "../../interfaces/Emotion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "../../interfaces/AuthState";
import BottomNavBar from "../../components/BottomNavBar";

const CalendarScreen: React.FC = () => {
  const router = useRouter();
  const [journals, setJournals] = useState<JournalEmotion[]>([]);
  const [loading, setLoading] = useState(true);
  const { authState, isAuthenticated, checkToken } = useAuth();

  const fetchJournals = async () => {
    const storedAuthState = await AsyncStorage.getItem("auth");
    if (!storedAuthState) {
      return false;
    }
    const authState = JSON.parse(storedAuthState) as AuthState;
    if (!authState?.token) {
      return false;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/journal-emotion/user/${authState?.utilisateur.id}`,
        {
          headers: { Authorization: `Bearer ${authState?.token}` },
        }
      );
      const data = await res.json();
      setJournals(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

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

  const markedDates = Array.isArray(journals)
    ? journals.reduce((acc, journal) => {
        const date = journal.date_enregistrement.split("T")[0];
        acc[date] = {
          customStyles: {
            container: {
              backgroundColor: "#C8E6C9",
            },
            text: {
              color: "white",
              fontWeight: "bold",
            },
          },
        };
        return acc;
      }, {} as any)
    : {};

  const handleDayPress = (day: any) => {
    const journal = journals.find((j) =>
      j.date_enregistrement.startsWith(day.dateString)
    );
    if (journal) {
      router.push({ pathname: "/emotion/details", params: { id: journal.id } });
    } else {
      router.push({
        pathname: "/emotion/add",
        params: { date: day.dateString },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>CesiZen</Text>
        <Text style={styles.title}>Calendrier</Text>

        <Calendar
          style={styles.calendar}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType="custom"
        />

        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => router.push("/emotion/report")}
        >
          <Text style={styles.exportButtonText}>Exporter vos informations</Text>
        </TouchableOpacity>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default CalendarScreen;

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
  title: {
    fontSize: 22,
    color: "#333",
    marginVertical: 20,
    fontWeight: "600",
  },
  calendar: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 20,
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
});
