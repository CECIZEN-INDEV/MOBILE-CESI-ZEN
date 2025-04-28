import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import BottomNavBar from "../../components/BottomNavBar";
import { EmotionReport } from "../../interfaces/EmotionRecord";

const ReportScreen: React.FC = () => {
  const { authState, checkToken, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<EmotionReport | null>(null);
  // État pour la période sélectionnée ("week", "month", "year")
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");

  // Vérification du token et récupération de l'utilisateur
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

  // Récupération du rapport en fonction de la période sélectionnée et de l'utilisateur connecté
  useEffect(() => {
    if (authState && authState.utilisateur && authState.token) {
      const userId = authState.utilisateur.id;
      (async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/emotion-report/${userId}?period=${selectedPeriod}`,
            {
              headers: { Authorization: `Bearer ${authState.token}` },
            }
          );
          const data = await res.json();
          setReport(data);
        } catch (error) {
          Alert.alert("Erreur", "Impossible de charger le rapport.");
        }
      })();
    }
  }, [authState, selectedPeriod]);

  if (loading || !authState) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Vérification du token en cours...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Fonction de génération du PDF avec le style amélioré (sans la barre verte sous le titre)
  const generatePDF = async () => {
    let html = `<html>
    <head>
      <meta charset="utf-8">
      <title>Rapport des émotions</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #fff;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 10px 0;
          /* Suppression de la barre verte en retirant border-bottom */
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 36px;
          color: #4CAF50;
          margin: 0;
        }
        .header p {
          font-size: 16px;
          color: #333;
          margin: 5px 0 0 0;
        }
        .info {
          text-align: center;
          margin-bottom: 20px;
        }
        .info p {
          font-size: 16px;
          color: #333;
          margin: 4px 0;
        }
        .title {
          font-size: 22px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
          color: #333;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: center;
        }
        th {
          background-color: #4CAF50;
          color: #fff;
        }
        tbody tr:nth-child(odd) {
          background-color: #f9f9f9;
        }
        .section-title {
          font-size: 18px;
          color: #333;
          margin-top: 30px;
          margin-bottom: 10px;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CesiZen</h1>
        <p>Rapport des Émotions</p>
      </div>
      <div class="info">
        <p><strong>Date d'export :</strong> ${new Date().toLocaleDateString(
          "fr-FR"
        )}</p>
        <p><strong>Période :</strong> ${
          selectedPeriod === "week"
            ? "Semaine"
            : selectedPeriod === "month"
            ? "Mois"
            : "Année"
        }</p>
      </div>
      <div class="section">
        <p class="section-title">Moyenne des émotions de base</p>
        <table>
          <thead>
            <tr>
              <th>Émotion</th>
              <th>Proportion</th>
            </tr>
          </thead>
          <tbody>`;
    if (report && report.average) {
      for (const emotion in report.average) {
        const proportion = report.average[emotion].toFixed(2) + " %";
        html += `<tr>
                 <td>${emotion}</td>
                 <td>${proportion}</td>
               </tr>`;
      }
    }
    html += `</tbody>
        </table>
      </div>
      <div class="section">
        <p class="section-title">Détails des entrées</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Émotion de base</th>
              <th>Commentaire</th>
            </tr>
          </thead>
          <tbody>`;
    if (report && report.data && Array.isArray(report.data)) {
      report.data.forEach((item) => {
        const date = new Date(item.date_enregistrement).toLocaleDateString(
          "fr-FR"
        );
        const base = item.emotion_base?.type_emotion || "";
        const comment = item.commentaire || "";
        html += `<tr>
                <td>${date}</td>
                <td>${base}</td>
                <td>${comment}</td>
              </tr>`;
      });
    }
    html += `</tbody>
        </table>
      </div>
    </body>
  </html>`;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      Alert.alert("Succès", "PDF généré avec succès à l'emplacement : " + uri);
    } catch (error) {
      Alert.alert("Erreur", "Échec de la génération du PDF.");
    }
  };

  const PeriodSelector = () => {
    const periods: { value: "week" | "month" | "year"; label: string }[] = [
      { value: "week", label: "Semaine" },
      { value: "month", label: "Mois" },
      { value: "year", label: "Année" },
    ];

    return (
      <View style={styles.periodContainer}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p.value}
            style={[
              styles.periodButton,
              selectedPeriod === p.value && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(p.value)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === p.value && styles.periodButtonTextActive,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>
          Cesi<Text style={styles.logoZen}>Zen</Text>
        </Text>
        <Text style={styles.title}>Export du rapport au format PDF</Text>

        <PeriodSelector />

        <TouchableOpacity style={styles.exportButton} onPress={generatePDF}>
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.exportButtonText}>Exporter en PDF</Text>
        </TouchableOpacity>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};

export default ReportScreen;

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
});
