import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { PencilLine } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import client from "../../api/client";

// 부모로부터 받을 데이터의 타입을 정의
interface MyProfileProps {
  user: {
    nickname: string;
    profileImage?: string;
  } | null;
}

// Props로 user 데이터를 받음
export default function MyProfile({ user }: MyProfileProps) {
  return (
    <View style={{ paddingRight: 0, marginBottom: 43 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: -5,
        }}
      >
        {/* 서버 데이터가 있으면 그 이미지를, 없으면 기본 아이콘을 보여준다. */}
        <View style={{ alignContent: 'flex-start' }}>
          {user?.profileImage ? (
            <Image 
              source={{ uri: user.profileImage }} 
              style={{ width: 140, height: 140, borderRadius: 70 }} 
            />
          ) : (
            <Icon name="search" size={140} color="#D9D9D9" />
          )}
        </View>
      
        <View style={{ flex: 1 }} />

        {/* 💡 서버에서 받아온 닉네임 표시 */}
        <Text style={{ fontSize: 25, marginRight: 5 }}>
          {user?.nickname || "로딩 중..."}
        </Text>
        
        <PencilLine size={20} />

        <Image
          source={{
            uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/uudb80hvHm/q7bw3xc1_expires_30_days.png",
          }}
          style={{ width: 20, height: 20 }}
        />
      </View>
    </View>
  );
}