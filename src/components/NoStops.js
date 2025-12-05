import React from "react";
import { View, Text } from "react-native";
import { styles } from "./NoStops.styles";

const NoStops = ({ t }) => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>📍</Text>
      </View>
      <Text style={styles.text}>{t("noStops")}</Text>
    </View>
  );
};

export default NoStops;
