import React from "react";
import { View, Text } from "react-native";
import { styles } from "./EmptyState.styles";

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>
      <Text style={styles.text}>Brak zamówionych kursów</Text>
      <Text style={styles.subtext}>Wszystkie kursy pojawią się tutaj</Text>
    </View>
  );
};

export default EmptyState;
