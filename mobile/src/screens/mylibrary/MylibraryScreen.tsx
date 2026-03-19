import React, { useEffect, useState, useCallback } from "react";
import { Text, StyleSheet, TextInput, ScrollView, View, ActivityIndicator, RefreshControl, Platform } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import MainLayout from "../../layouts/MainLayout";
import LibrarySection from "../../components/library/LibrarySection";
import Search from "../../components/common/Search";
import client from "../../api/client";
import { SearchIcon } from "lucide-react-native";

const API_URL = client.defaults.baseURL + "/user-books";

export default function LibraryScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const fetchAllBooks = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      
      if (data?.books && Array.isArray(data.books)) {
        setBooks(data.books);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error("전체 서재 로딩 실패:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchAllBooks(books.length === 0);
    }
  }, [isFocused, fetchAllBooks]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllBooks(false);
  };

  return (
    <MainLayout>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>내 서재</Text>
      </View>

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

      <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7E8341"/>
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#7E8341" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.sectionWrapper}>
            <LibrarySection
              title="독서 위시리스트"
              books={books.filter(b => b.status === "WISH")}
              type="wish"
            />

            <LibrarySection
              title="독서 중"
              books={books.filter(b => b.status === "READING")}
              type="reading"
            />

            <LibrarySection
              title="독서 완료"
              books={books.filter(b => b.status === "FINISHED")}
              type="finished"
            />
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({

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
  headerContainer: {
    width: '100%', 
    paddingHorizontal: 26, 
    paddingTop: 20,
    backgroundColor: '#FDFDFD', // 배경색은 MainLayout에 맞춰 조절하세요
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 0,
    textAlign: 'left',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40, // 하단 탭바에 가려지지 않게 여백 추가
  },
  sectionWrapper: {
    marginTop: 10,
  }
  });