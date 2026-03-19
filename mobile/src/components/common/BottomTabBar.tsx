
// src/components/common/BottomTabBar.tsx// src/components/common/BottomTabBar.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Home, Bookmark, Users, User } from "lucide-react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const NAV_ITEMS = [
  { name: 'Home', icon: Home, label: '홈' },
  { name: 'Library', icon: Bookmark, label: '내서재' },
  { name: 'Groups', icon: Users, label: '독서모임' },
  { name: 'My', icon: User, label: '마이' },
];

export default function BottomTabBar(props: any) {
  console.log("📍 TabBar Props:", Object.keys(props));
  // const navigation = useNavigation<any>();
  // const route = useRoute();
  const insets = useSafeAreaInsets();

  const state = props?.state;
  const navigation = props?.navigation;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const item = NAV_ITEMS.find((n) => n.name === route.name);
        
        // 혹시 매칭되는 아이템이 없으면 렌더링하지 않음 (방어 코드)
        if (!item) return null;
        const Icon = item.icon;

        const onPress = () => {
          // 탭 클릭 시 발생하는 기본 이벤트 (포커스 등 처리)
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          // 현재 탭이 아니고, 이벤트가 취소되지 않았다면 해당 화면으로 이동
          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={item.name}
            style={styles.tabItem}
            onPress={onPress}
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