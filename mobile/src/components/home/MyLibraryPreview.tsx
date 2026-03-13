import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import LibrarySection from "../library/LibrarySection";
import client from "../../api/client";

const API_URL = "http://192.168.132.1:3000/user-books";

export default function MyLibraryPreview() {
  const [readingBooks, setReadingBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

const fetchReadingBooks = async () => {
    try {
      console.log("🔄 [MyLibraryPreview] 데이터 갱신 시도 중...");

      const response = await client.get('/user-books', {
        params: { status: 'READING' }
      });

      const data = response.data;
      
      if (data?.books && Array.isArray(data.books)) {
        console.log(`✅ [MyLibraryPreview] 갱신 완료: ${data.books.length}권`);
        setReadingBooks(data.books);
      }
    } catch (err: any) {
      console.error("❌ 미리보기 서재 로딩 실패:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchReadingBooks();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.previewTitle}>내 서재</Text>

      {loading ? (
        <ActivityIndicator size="small" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <LibrarySection
          title="독서 중"
          books={readingBooks}
          type="reading"
          hideHeader={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginTop: 46, 
    width: '100%', 
    paddingHorizontal: 20 
  },
  previewTitle: { 
    fontSize: 22, 
    marginBottom: 15, 
    fontWeight: "bold",
    textAlign: 'center' 
  },
});