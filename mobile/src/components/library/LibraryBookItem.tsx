import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface LibraryBookItemProps {
  title: string;
  coverImage?: string; 
  type?: "wish" | "reading" | "finished";
}

export default function LibraryBookItem({ coverImage, type }: LibraryBookItemProps) {
  const getBackgroundColor = () => {
    switch(type) {
      case 'wish': return '#C5CC9C';     // 연한 연두 (위시리스트)
      case 'reading': return '#A6AE7A';  // 중간 올리브 (독서 중)
      case 'finished': return '#8E9469'; // 진한 올리브 (독서 완료)
      default: return '#D9D9D9';         // 기본 회색
    }
  };
  return (
    <View style={{ flex: 1, marginRight: 20 }}>
      {coverImage ? (
        <Image 
          source={{ uri: coverImage }} 
          style={{ 
            width: '100%', 
            aspectRatio: 2 / 3,
            borderRadius: 8, 
            //marginBottom: 10 
          }}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: getBackgroundColor() }]}
        />
      )}

      <Text style={{ color: "#000000", fontSize: 14 }} numberOfLines={2}>
        {/* {title} */}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 8,
  }
});