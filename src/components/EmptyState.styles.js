import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../styles/theme";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.massive,
    paddingHorizontal: spacing.huge,
  },
  icon: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  text: {
    fontSize: typography.fontSize.xxl,
    color: colors.textLight,
    fontWeight: typography.fontWeight.medium,
  },
  subtext: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
});
