import React from "react";
import { View, Text, Image } from "react-native";

interface LibraryBookItemProps {
  title: string;
  coverImage?: string; 
}

export default function LibraryBookItem({ title, coverImage }: LibraryBookItemProps) {
  return (
    <View style={{ flex: 1, marginRight: 20 }}>
      {coverImage ? (
        <Image 
          source={{ uri: coverImage }} 
          style={{ 
            width: '100%', 
            aspectRatio: 3 / 4,
            borderRadius: 4, 
            marginBottom: 10 
          }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ 
          width: '100%', 
          aspectRatio: 3 / 4, 
          backgroundColor: "#D9D9D9", 
          borderRadius: 4, 
          marginBottom: 10 
        }} />
      )}

      <Text style={{ color: "#000000", fontSize: 14 }} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}