import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Platform } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from "@react-navigation/native";
// 아이콘 라이브러리 확인 필수! lucide-react-native가 아니면 기존 것으로 교체하세요.
import { Users, BookOpen, ChevronRight, Search as SearchIcon } from 'lucide-react-native';

import MainLayout from "../layouts/MainLayout";

const { width } = Dimensions.get('window');

// 💡 테스트용 데이터 (null로 두면 빈 화면 스타일이 나옵니다)
const READING_GROUPS = null; // [] 또는 null
const MY_BOOKS = null; // [] 또는 null

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <MainLayout title="우리독서">
      {/* 1. 검색바 영역: 배경색 #F8FAF8 */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#7E8341" />
          <TextInput
            style={styles.searchInput}
            placeholder="책 제목, 저자 검색"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 기존에 있던 공지/광고 배너 뷰를 완전히 삭제했습니다. */}

        {/* 2. 참여중인 그룹 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.row}>
              <Users size={22} color="#7E8341"/>
              <Text style={styles.sectionTitle}>참여중인 그룹</Text>
            </View>
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("GroupList")}>
              <Text style={styles.moreText}>전체보기</Text>
              <ChevronRight size={16} color="#7E8341" />
            </TouchableOpacity>
          </View>

          {/* 데이터가 없을 때 (빈 공간 처리) */}
          {(!READING_GROUPS || READING_GROUPS.length === 0) ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>참여 중인 모임이 없습니다.</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate("CreateGroupScreen")}>
                <Text style={styles.emptyButtonText}>모임 찾아보기</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // 데이터가 있을 때 로직 (생략 - 기존 코드 유지)
            <View><Text>데이터 있음</Text></View>
          )}
        </View>

        {/* 3. 읽고 있는 책 섹션 (첫 번째 이미지처럼 하단 전체가 흰색 배경) */}
        <View style={styles.librarySection}>
          <View style={styles.sectionHeader}>
            <View style={styles.row}>
              <BookOpen size={22} color="#7E8341"/>
              <Text style={styles.sectionTitle}>읽고 있는 책</Text>
            </View>
            {/* 💡 요청하신 전체보기 버튼 추가 */}
            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("Library")}>
              <Text style={styles.moreText}>전체보기</Text>
              <ChevronRight size={16} color="#7E8341" />
            </TouchableOpacity>
          </View>

          {/* 데이터가 없을 때 (빈 공간 처리) */}
          {(!MY_BOOKS || MY_BOOKS.length === 0) ? (
            <View style={styles.emptyCardInside}>
              <Text style={styles.emptyText}>지금 읽고 있는 책이 없습니다.</Text>
              <TouchableOpacity style={styles.emptyButtonInside} onPress={() => navigation.navigate("SearchScreen")}>
                <Text style={styles.emptyButtonTextInside}>책 등록하기</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // 데이터가 있을 때 로직 (생략 - 기존 코드 유지)
            <View><Text>데이터 있음</Text></View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  // 전체 배경색 연베이지
  scrollView: { flex: 1, backgroundColor: '#F8FAF8' },
  
  // 검색바: 배경색 분리 및 그림자
  searchBarWrapper: { padding: 16, backgroundColor: '#F8FAF8', zIndex: 10 },
  searchBar: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF',
    paddingHorizontal: 15, 
    height: 52, 
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1 },
      android: { elevation: 3 },
    }),
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#122506' },
  
  // 섹션 공통 스타일
  section: { paddingHorizontal: 16, marginTop: 10, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 19, fontWeight: 'bold', color: '#122506', marginLeft: 8 },
  moreText: { color: '#7E8341', fontSize: 15, marginRight: 2 },
  row: { flexDirection: 'row', alignItems: 'center' },
  
  // 데이터 없을 때 카드 (베이지색 배경 위)
  emptyCard: { 
    backgroundColor: '#FFF', 
    padding: 30, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 1,
  },
  
  // 읽고 있는 책 섹션: 첫 번째 이미지처럼 하단을 통째로 흰색 배경으로 바꿈
  librarySection: { 
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    flex: 1,
    minHeight: 300, // 빈 공간 확보
  },
  
  // 데이터 없을 때 카드 (흰색 배경 위)
  emptyCardInside: { 
    backgroundColor: '#F8FAF8', 
    padding: 30, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  
  // 공통 빈 화면 스타일
  emptyText: { color: '#666', fontSize: 15, marginBottom: 15 },
  emptyButton: { backgroundColor: '#7E8341', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  emptyButtonInside: { backgroundColor: '#EDE5CB', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  emptyButtonText: { color: '#FFF', fontWeight: '600' },
  emptyButtonTextInside: { color: '#3D401A', fontWeight: '600' },
});

export default HomeScreen;