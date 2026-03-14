import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Search from "../components/common/Search";
import Feather from '@expo/vector-icons/Feather';
import client from "../api/client";

const RECENT_SEARCH_KEY = "recent_searches";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigation = useNavigation<any>();

  // 🔍 도서 검색 API 호출
  // const handleSearch = async (text: string) => {
  //   setSearchQuery(text);
  //   if (text.trim().length > 0) {
  //     try {
  //       // API 명세서의 /books?query={searchKeyword} 사용
  //       const response = await fetch(`http://192.168.219.112:3000/book?query=${encodeURIComponent(text)}`);
  //       if (!response.ok) throw new Error('서버 응답 없음');
  //       const data = await response.json();
        

  //       setResults(data.books); 
        
  //     } catch (err) {
  //       console.error("검색 에러:", err);
  //     }
  //   } else {
  //     setResults([]);
  //   }
  // };

  // 🔍 도서 검색 API 실행 함수
  const performSearch = async () => {
    if (searchQuery.trim().length === 0) return;

    try {
      setIsLoading(true);
      console.log(`🚀 검색 시작: ${searchQuery} (경로: /book)`);

      // 💡 fetch 대신 우리가 만든 client 사용! 
      // 아까 확인한 대로 백엔드가 단수형(/book)이므로 /book으로 보냅니다.
      const response = await client.get('/book', {
        params: { 
          query: searchQuery, 
          target: 'title' 
        }
      });

      console.log("✅ 검색 성공:", response.data);
      
      // 데이터 구조가 { books: [...] } 인지 확인 후 세팅
      const booksData = response.data.books || response.data;
      setResults(Array.isArray(booksData) ? booksData : []);

    } catch (err: any) {
      console.error("❌ 검색 에러:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const loadSearches = async () => {
      try {
        const saved = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch (err) {
        console.error("검색 기록 로드 실패:", err);
      }
    };
    loadSearches();
  }, []);

  const saveRecentSearch = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const filtered = recentSearches.filter((item) => item !== trimmedText);
    const updated = [trimmedText, ...filtered].slice(0, 10);

    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
  };

  const removeRecentSearch = async (text: string) => {
    const updated = recentSearches.filter((item) => item !== text);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
  };

  // 도서 검색
  const handleSearch = async (overrideQuery?: string) => {
    const query = overrideQuery || searchQuery;
    if (query.trim().length > 0) {
      try {
        setIsLoading(true);
        saveRecentSearch(query);
        const response = await fetch(client.defaults.baseURL + `/book?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('서버 응답 없음');
        const data = await response.json();
        
        setResults(data.books || []);
        
      } catch (err) {
        console.error("검색 에러:", err);
      } finally {
        setIsLoading(false);
        Keyboard.dismiss(); 
      }
    } else {
      setResults([]);
    } 
  };

  // 검색 결과 아이템 렌더링
  const renderBookItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.bookItem} 
      onPress={() => {
        const cleanIsbn = item.isbn ? item.isbn.split(' ')[0] : "";
        navigation.navigate("BookDetailScreen", { bookId: cleanIsbn });
      }}
    >
      <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.bookDetails}>{item.author} · {item.publisher}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Search 
        isFullMode={true}
        onBack={() => { Keyboard.dismiss(); navigation.goBack(); }}
        value={searchQuery}
        onChangeText={(text: string) => setSearchQuery(text)}
        onSubmit={() => {
            console.log("엔터 클릭! 검색어:", searchQuery);
            performSearch();
            // 검색 기록 저장 API 호출 등을 여기서 하시면 됩니다.
            handleSearch();
        }}
        placeholder="제목, 저자, 출판사 검색"
      />
      {searchQuery.length > 0 ? (
        <FlatList 
          data={results}
          keyExtractor={(item, index) => `${item.isbn}_${index}`}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>검색 결과가 없습니다.</Text>}
        />
      ) : (
        <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>최근 검색</Text>
        </View>
        {recentSearches.length > 0 ? (
            recentSearches.map((item, index) => (
              <View key={index} style={styles.recentItemRow}>
                <TouchableOpacity 
                  style={{ flex: 1 }}
                  onPress={() => {
                    setSearchQuery(item);
                    handleSearch(item); 
                  }}
                >
                  <Text style={styles.recentItemText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeRecentSearch(item)}>
                  <Feather name="x" size={16} color="#AAA" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
        <Text style={styles.emptyText}>최근 검색 내역이 없습니다.</Text>
        )}
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  recentItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  recentItemText: { fontSize: 16, color: '#333' },
  container: { flex: 1, backgroundColor: "#FFF" },
  listContent: { paddingHorizontal: 20, paddingTop: 10 },
  bookItem: { flexDirection: "row", marginBottom: 15, alignItems: "center" },
  coverImage: { width: 50, height: 75, borderRadius: 4, backgroundColor: "#F5F5F5" },
  bookInfo: { flex: 1, marginLeft: 15 },
  bookTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  bookDetails: { fontSize: 13, color: "#666", marginTop: 4 },
  recentSection: { padding: 20 },
  recentHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  recentTitle: { fontSize: 16, fontWeight: "bold" },
  viewAll: { color: "#3897f0", fontWeight: "bold" },
  emptyText: { color: "#AAA", textAlign: "center", marginTop: 50 }
});