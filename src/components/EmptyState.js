import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>
      <Text style={styles.text}>Brak zamówionych kursów</Text>
      <Text style={styles.subtext}>Wszystkie kursy pojawią się tutaj</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: "#999",
    fontWeight: "500",
  },
  subtext: {
    fontSize: 14,
    color: "#9ca3af",
  },
});

export default EmptyState;
