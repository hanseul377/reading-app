import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { PencilLine } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import client from "../../api/client";

export default function MyProfile() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        setLoading(true);
        // 💡 API 명세서: GET /user/me
        const response = await fetch(client.defaults.baseURL + "/user/me");
        
        if (!response.ok) throw new Error("유저 정보를 불러올 수 없습니다.");
        
        const data = await response.json();

        if (data.user) {
          setUserInfo(data.user); 
          console.log("데이터 로드 완료:", data.user.nickname);
        } else {
          console.error("응답에 user 정보가 없습니다:", data);
        }
        //setUserInfo(data); // { email, nickname, profileImage, grouplist } 저장
      } catch (err) {
        console.error("내 정보 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyInfo();
  }, []);

  // 로딩 중일 때 표시
  if (loading) {
    return <ActivityIndicator size="large" color="#D9D9D9" style={{ marginBottom: 43 }} />;
  }

  return (
    <View style={{ paddingRight: 0, marginBottom: 43 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: -5,
        }}
      >
        <View style={{ alignContent: 'flex-start' }}>
          {userInfo?.profileImage ? (
            <Image 
              source={{ uri: userInfo.profileImage }} 
              style={{ width: 140, height: 140, borderRadius: 70 }} 
            />
          ) : (
            <Icon name="account-circle" size={140} color="#D9D9D9" /> 
          )}
        </View>
      
        <View style={{ flex: 1 }} />

        {/* 💡 서버에서 받아온 닉네임 표시 */}
        <Text style={{ fontSize: 25, marginRight: 5 }}>
          {userInfo?.nickname || "(닉네임)"}
        </Text>
        <PencilLine size={20} color="#000" />

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