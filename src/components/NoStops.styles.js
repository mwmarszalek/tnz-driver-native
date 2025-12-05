import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, typography, shadows } from "../styles/theme";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing.xxxl,
    marginVertical: 10,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderLight,
    borderStyle: "dashed",
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    ...shadows.primary,
  },
  iconText: {
    fontSize: typography.fontSize.xxxl,
  },
  text: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    textAlign: "center",
  },
});
