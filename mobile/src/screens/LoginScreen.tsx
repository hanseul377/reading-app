import React from "react";
import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AuthInput from "../components/auth/AuthInput";
import client from "../api/client";
import axios from 'axios';

export default function LoginScreen({ navigation }: any) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
    try {
      const response = await client.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      console.log("✅ 로그인 성공 데이터:", response.data);
      const { token } = response.data; 

      await AsyncStorage.setItem('userToken', token);
      navigation.navigate('Main');

    } catch (error: any) {
      // 에러처리
      if (error.response) {
        console.log("❌ 에러 상태:", error.response.status);
        console.log("❌ 에러 내용:", error.response.data);
        const errorMessage = error.response.data.error || "이메일 또는 비밀번호를 확인하세요.";
        Alert.alert("로그인 실패", errorMessage);
      } else {
        console.log("❌ 네트워크 에러:", error.message);
        Alert.alert("연결 에러", "서버 주소(ngrok)가 변경되었거나 오프라인일 수 있습니다.");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          alignItems: "center", 
          paddingTop: 100, 
          paddingHorizontal: 40 
        }}
        enableOnAndroid={true} // 안드로이드 대응
        extraScrollHeight={20} // 키보드와 입력창 사이 간격
      >
        <Image 
          source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/uudb80hvHm/cvdykkw8_expires_30_days.png" }}
          style={{ width: 80, height: 80, marginBottom: 10 }} 
        />
        <Text style={{ fontSize: 20, marginBottom: 40 }}>우리독서</Text>

        {/* value와 onChangeText로 상태 연결 */}
        <AuthInput 
          label="이메일 주소" 
          placeholder="이메일 주소를 입력해주세요." 
          value={email}
          onChangeText={setEmail}
        />
        <AuthInput 
          label="비밀번호" 
          placeholder="비밀번호를 입력해주세요." 
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={{ 
            backgroundColor: "#3D401A", 
            width: '100%', 
            padding: 15, 
            borderRadius: 4, 
            alignItems: 'center', 
            marginBottom: 10 
          }} 
          onPress={handleLogin} // 바로 이동하지 않고 함수 호출!
        >
          <Text style={{ color: "#FFF", fontSize: 18 }}>로그인</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: "#EFEBE7", 
            width: '100%', 
            padding: 15, 
            borderRadius: 4, 
            alignItems: 'center' 
          }} 
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={{ color: "#3D401A", fontSize: 18 }}>회원가입</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}