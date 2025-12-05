import React, { useState } from "react";
import { View, Text, TouchableOpacity, Switch, Modal } from "react-native";
import { styles } from "./Header.styles";
import { colors } from "../styles/theme";

const LANGUAGES = [
  { code: "pl", flag: "🇵🇱", name: "Polski" },
  { code: "uk", flag: "🇺🇦", name: "Українська" },
];

const Header = ({
  onCallDispatcher,
  locationTracking,
  onToggleGPS,
  t,
  language,
  onToggleLanguage,
}) => {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === language);

  const handleLanguageSelect = (langCode) => {
    if (langCode !== language) {
      onToggleLanguage();
    }
    setLanguageMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>🚌 {t("driverPanel")}</Text>
        <Text style={styles.subtitle}>{t("transportLine")}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          style={styles.languageBtn}
          onPress={() => setLanguageMenuOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.languageBtnText}>
            {currentLanguage?.flag} {currentLanguage?.name}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callBtn}
          onPress={onCallDispatcher}
          activeOpacity={0.7}
        >
          <Text style={styles.callBtnText}>📞 {t("dispatcher")}</Text>
        </TouchableOpacity>

        <View style={styles.locationToggleWrapper}>
          <Text style={styles.locationLabel}>📍 {t("online")}</Text>
          <Switch
            value={locationTracking}
            onValueChange={onToggleGPS}
            trackColor={{ false: "rgba(255,255,255,0.3)", true: "#22c55e" }}
            thumbColor={colors.white}
            ios_backgroundColor="rgba(255,255,255,0.3)"
          />
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={languageMenuOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLanguageMenuOpen(false)}
        >
          <View style={styles.languageMenu}>
            <Text style={styles.languageMenuTitle}>{t("selectLanguage")}</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageMenuItem,
                  language === lang.code && styles.languageMenuItemActive,
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.languageMenuItemFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.languageMenuItemText,
                    language === lang.code &&
                      styles.languageMenuItemTextActive,
                  ]}
                >
                  {lang.name}
                </Text>
                {language === lang.code && (
                  <Text style={styles.languageMenuItemCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Header;
