// MainLayout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTabBar from "../components/common/BottomTabBar";
import AppHeader from "../components/common/AppHeader";

export default function MainLayout({ children, title = "우리독서", showHeader = true, showTabBar = true }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* ✅ expo-status-bar 사용 */}
      <StatusBar style="light" />

      {/* 상단 - 상태바 영역 + 헤더 */}
      {showHeader && (
        <View style={{ backgroundColor: "#3D401A", paddingTop: insets.top }}>
          <AppHeader title={title} />
        </View>
      )}

      {/* 중앙 컨텐츠 */}
      <View style={styles.content}>
        {children}
      </View>

      {/* 하단 - 탭바 고정 60px + 홈바 여백만 분리 */}
      {showTabBar && (
        <>
          <BottomTabBar />
          {/*<View style={{ height: insets.bottom, backgroundColor: "#7E8341" }} />*/}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAF8" },
  content: { flex: 1 },
});