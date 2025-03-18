// emotion/calendar.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { JournalEmotion } from "../../interfaces/Emotion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "../../interfaces/AuthState";

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
      //console.log(data);
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
      } else setLoading(false);
    })();

    return () => {
      isCheck = false;
    };
  }, []);

  if (loading || !authState) {
    return (
      <View style={styles.container}>
        <Text>Vérification du token en cours...</Text>
      </View>
    );
  }

  // Utilisation de customStyles pour avoir la date en rouge
  const markedDates = Array.isArray(journals)
    ? journals.reduce((acc, journal) => {
        const date = journal.date_enregistrement.split("T")[0];
        acc[date] = {
          customStyles: {
            container: {
              backgroundColor: "red",
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
        pathname: "/emotion/edit",
        params: { date: day.dateString },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="custom"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: "#fff" },
});

export default CalendarScreen;
