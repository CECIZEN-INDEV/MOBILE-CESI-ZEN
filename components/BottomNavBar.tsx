import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";

enableScreens();

const BottomNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // On détecte les pages
  const isHome = pathname === "/utilisateur/home";
  const isCalendar = pathname === "/emotion/calendar";
  const isProfil = pathname === "/utilisateur/profil";

  const handleNavigation = (targetPath: string) => {
    if (pathname !== targetPath) {
      if (
        pathname === "/emotion/calendar" &&
        targetPath === "/utilisateur/home"
      ) {
        router.replace({
          pathname: targetPath,
          params: {},
        });
      } else {
        router.push(targetPath);
      }
    }
  };

  return (
    <View style={styles.navBarWrapper}>
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.iconContainer, isHome && styles.activeIconContainer]}
          onPress={() => handleNavigation("/utilisateur/home")}
        >
          <Ionicons name="home-outline" size={32} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconContainer,
            isCalendar && styles.activeIconContainer,
          ]}
          onPress={() => handleNavigation("/emotion/calendar")}
        >
          <Ionicons name="happy-outline" size={32} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconContainer, isProfil && styles.activeIconContainer]}
          onPress={() => handleNavigation("/utilisateur/profil")}
        >
          <Ionicons name="person-circle-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomNavBar;

const styles = StyleSheet.create({
  navBarWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "#FFFFFF",
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#FFFFF",
    borderRadius: 20,
    width: "90%",
  },

  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },

  activeIconContainer: {
    backgroundColor: "#C8E6C9",
  },
});
