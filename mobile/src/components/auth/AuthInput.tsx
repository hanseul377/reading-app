import React from "react";
import { View, Text, TextInput } from "react-native";

export default function AuthInput({ label, placeholder, secureTextEntry, value, onChangeText }: any) {
  return (
    <View style={{ marginBottom: 20, alignSelf: "stretch" }}>
      <Text style={{ color: "#000000", fontSize: 13, marginBottom: 8 }}>
        {label}
      </Text>
      <View style={{ borderBottomWidth: 1, borderBottomColor: "#B8B8B8", paddingVertical: 5 }}>
        <TextInput 
          placeholder={placeholder}
          placeholderTextColor="#B8B8B8"
          style={{ color: "#000", fontSize: 14, padding: 0 }}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          // 입력창에 값 연결
          value={value} 
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}