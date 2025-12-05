import { StyleSheet } from "react-native";
import { colors, spacing, shadows } from "../styles/theme";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    maxWidth: 600,
    minWidth: 360,
    width: "100%",
    ...shadows.xl,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.xl,
  },
});
