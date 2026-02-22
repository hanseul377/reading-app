import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AuthInput from "../components/auth/AuthInput";
import { signUp } from "../api/auth"; 

export default function SignupScreen({ navigation }: any) {
  // 입력값을 관리할 상태(State) 선언
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 가입하기 버튼 클릭 시 실행될 함수
  const handleSignup = async () => {
    // 유효성 검사
    if (!email || !password || !nickname) {
      Alert.alert("알림", "모든 정보를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const result = await signUp({ email, password, nickname });
      Alert.alert("성공", "회원가입이 완료되었습니다!", [
        { text: "확인", onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert("실패", error.response?.data?.message || "서버와 연결할 수 없습니다.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10, width: 50 }}>
          <Text style={{ fontSize: 24, color: "#000" }}>{"←"}</Text>
        </TouchableOpacity>
      </View>
        
      <KeyboardAwareScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 40, paddingTop: 20, paddingBottom: 60 }}
        enableOnAndroid={true}
        extraScrollHeight={30}
      >
        <Text style={{ fontSize: 36, fontWeight: "bold", marginBottom: 40, textAlign: "center" }}>
          회원가입
        </Text>

        {/* 3. 입력 컴포넌트에 onChangeText와 value 연결 */}
        <AuthInput 
          label="이름" 
          placeholder="이름을 입력해주세요." 
          value={nickname}
          onChangeText={setNickname} 
        />
        <AuthInput 
          label="이메일 주소" 
          placeholder="이메일 주소를 입력해주세요." 
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <AuthInput 
          label="비밀번호" 
          placeholder="비밀번호를 입력해주세요." 
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <AuthInput 
          label="비밀번호 확인" 
          placeholder="비밀번호를 다시 한번 입력해주세요." 
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity 
          style={{ 
            backgroundColor: "#486240", 
            padding: 15, 
            borderRadius: 4, 
            alignItems: 'center', 
            marginTop: 20 
          }} 
          onPress={handleSignup} // 가입 함수 연결
        >
          <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600" }}>
            가입하기
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}