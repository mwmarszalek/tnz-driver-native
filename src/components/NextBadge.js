import React from "react";
import { View, Text } from "react-native";
import { styles } from "./NextBadge.styles";

const NextBadge = ({ minutesToDeparture }) => {
  return (
    <View style={styles.container}>
      <View style={styles.pulseDot} />
      <Text style={styles.text}>
        Najbliższy odjazd (za {minutesToDeparture} min)
      </Text>
    </View>
  );
};

export default NextBadge;
