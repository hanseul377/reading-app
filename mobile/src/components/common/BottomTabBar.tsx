
// src/components/common/BottomTabBar.tsx// src/components/common/BottomTabBar.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Bookmark, Users, User } from "lucide-react-native";

const NAV_ITEMS = [
  { name: 'Home', icon: Home, label: '홈' },
  { name: 'Library', icon: Bookmark, label: '내서재' },
  { name: 'Groups', icon: Users, label: '독서모임' },
  { name: 'My', icon: User, label: '마이' },
];

export default function BottomTabBar() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {NAV_ITEMS.map((item) => {
        const isActive = route.name === item.name;
        const Icon = item.icon;

        return (
          <TouchableOpacity
            key={item.name}
            style={styles.tabItem}
            onPress={() => navigation.navigate(item.name)}
          >
            <Icon
              size={24}
              color="#F8FAF8"
              style={{ opacity: isActive ? 1 : 0.6 }}
            />
            <Text style={[styles.label, { opacity: isActive ? 1 : 0.6 }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#7E8341",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 6,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 4, // 아이콘 위아래 여백
  },
  label: {
    color: "#F8FAF8",
    fontSize: 11,
    marginTop: 4,
  },
});