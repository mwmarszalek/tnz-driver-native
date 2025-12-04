import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/app";

const NoStops = () => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>📍</Text>
      </View>
      <Text style={styles.text}>Brak zamówionych przystanków</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 30,
    marginVertical: 10,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: 28,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    textAlign: "center",
  },
});

export default NoStops;
