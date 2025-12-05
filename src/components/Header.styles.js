import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, typography, shadows } from "../styles/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...shadows.md,
  },
  left: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: typography.fontSize.lg,
  },
  right: {
    alignItems: "flex-end",
    gap: 10,
    minWidth: 140,
  },
  languageBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 140,
  },
  languageBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    textAlign: "center",
  },
  callBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 140,
  },
  callBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    textAlign: "center",
  },
  locationToggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 140,
    justifyContent: "space-between",
  },
  locationLabel: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  // Language Menu Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  languageMenu: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    minWidth: 200,
    ...shadows.xl,
  },
  languageMenuTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  languageMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.background.secondary,
  },
  languageMenuItemActive: {
    backgroundColor: colors.primary,
  },
  languageMenuItemFlag: {
    fontSize: typography.fontSize.xl,
    marginRight: spacing.md,
  },
  languageMenuItemText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    flex: 1,
  },
  languageMenuItemTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
  },
  languageMenuItemCheck: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
});
