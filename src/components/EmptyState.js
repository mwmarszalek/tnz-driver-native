import React from "react";
import { View, Text } from "react-native";
import { styles } from "./EmptyState.styles";

const EmptyState = ({ t }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>
      <Text style={styles.text}>{t("noCoursesToday")}</Text>
      <Text style={styles.subtext}>{t("checkSchedule")}</Text>
    </View>
  );
};

export default EmptyState;
