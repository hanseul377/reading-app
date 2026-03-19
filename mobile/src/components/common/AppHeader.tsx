
// src/components/common/AppHeader.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AppHeaderProps {
  title?: string;
}

export default function AppHeader({ title = "우리독서" }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: "#3D401A",
    justifyContent: "center",
    alignItems: "center",
    // ✅ 그림자 전부 제거 - 경계선 원인
  },
  title: {
    color: "#F8FAF8",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
});