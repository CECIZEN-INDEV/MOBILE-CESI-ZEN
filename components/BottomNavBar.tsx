// components/BottomNavBar.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const BottomNavBar = () => {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.push("/utilisateur/home")}>
        <Ionicons name="home-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/emotion/calendar")}>
        <Ionicons name="happy-outline" size={28} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/utilisateur/profil")}>
        <Ionicons name="person-circle-outline" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#E8F5E9",
  },
});

export default BottomNavBar;
