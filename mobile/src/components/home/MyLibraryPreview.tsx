import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import LibrarySection from "../library/LibrarySection";
import client from "../../api/client";

const API_URL = client.defaults.baseURL + "/user-books";

export default function MyLibraryPreview() {
  const [readingBooks, setReadingBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchReadingBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        
        if (data?.books && Array.isArray(data.books)) {
          const onlyReading = data.books.filter((b: any) => b.status === "READING");
          setReadingBooks(onlyReading);
        }
      } catch (err) {
        console.error("미리보기 서재 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingBooks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.previewTitle}>내 서재</Text>

      <View style={styles.titleDivider} />

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
  titleDivider: {
    height: 1,
    backgroundColor: "#000",
    width: '100%',
    marginBottom: 20,
  },
});