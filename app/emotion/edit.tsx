import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const EditEmotionScreen: React.FC = () => {
  const { id, date } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>
        {id ? `Modifier Emotion ID: ${id}` : `Créer Emotion pour ${date}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});

export default EditEmotionScreen;
