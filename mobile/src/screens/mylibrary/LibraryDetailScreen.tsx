import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainLayout from "../../layouts/MainLayout";
import LibraryBookItem from "../../components/library/LibraryBookItem";
import Search from "../../components/common/Search";
import Feather from '@expo/vector-icons/Feather';
import client from "../../api/client";

const CONFIG = {
  wish: {
    title: "독서 위시리스트",
    status: "WISH",
    iconName: "shopping-bag"
  },
  reading: {
    title: "독서 중",
    status: "READING",
    iconName: "book-open"
  },
  finished: {
    title: "독서 완료",
    status: "FINISHED",
    iconName: "award"
  },
};

export default function LibraryDetailScreen() {
  const route = useRoute<any>();
  const type = route.params?.type || "wish";
  const { title, status, iconName } = CONFIG[type];
  const navigation = useNavigation<any>();

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteBook = async (userBookId: string, bookTitle: string) => {
    Alert.alert(
      "책 삭제",
      `'${bookTitle}'을(를) 책장에서 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { 
          text: "확인", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(client.defaults.baseURL + `/user-books/${userBookId}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                setBooks(prev => prev.filter(b => b.userBookId !== userBookId));
                Alert.alert("알림", "책장에서 삭제되었습니다.");
              } else {
                const errorText = await response.text();
                console.log("❌ 삭제 실패 응답:", errorText);
                throw new Error("삭제 실패");
              }
            } catch (err) {
              console.error("삭제 중 오류:", err);
              Alert.alert("오류", "삭제에 실패했습니다.");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(client.defaults.baseURL + `/user-books?status=${status}`);
        if (!response.ok) throw new Error('네트워크 응답이 좋지 않습니다.');
        const data = await response.json();
        setBooks(data.books);
      } catch (err) {
        console.error("데이터를 가져오는데 실패했습니다:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserBooks();
  }, [type]);

  return (
    <MainLayout showHeader={false}>
      <View style={styles.container}>
        
        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backArrow}>{"←"}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <Feather name={iconName as any} size={18} color="black" />
          </View>
          <View style={styles.divider} />
        </View>

        <Search 
          placeholder="검색" 
          onPress={() => navigation.navigate("SearchScreen")} 
          editable={false} 
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.editBtnWrapper}>
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editBtnText}>{isEditing ? "완료" : "편집"}</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#000" style={styles.loader} />
          ) : (
            <View style={styles.bookGrid}>
              {books.length > 0 ? (
                books.map((book) => (
                  <View key={book.userBookId} style={styles.bookItemWrapper}>
                    <TouchableOpacity 
                      disabled={isEditing} 
                      style={{ opacity: isEditing ? 0.5 : 1 }}
                      onPress={() => {
                        const cleanIsbn = book.isbn.split(' ')[0];
                        navigation.navigate("BookDetailScreen", { bookId: cleanIsbn });
                      }}
                    >
                      <LibraryBookItem title={book.title} coverImage={book.coverImage} />
                    </TouchableOpacity>

                    {isEditing && (
                      <TouchableOpacity 
                        style={styles.deleteIcon} 
                        onPress={() => handleDeleteBook(book.userBookId, book.title)}
                      >
                        <Feather name="x-circle" size={22} color="black" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>등록된 책이 없습니다.</Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingVertical: 28, paddingHorizontal: 14},
  fullSearchWrapper: { flex: 1, backgroundColor: '#FFF' },
  recentSearchSection: {padding: 20 },
  recentTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15 },
  emptyRecent: { color: '#888', textAlign: 'center', marginTop: 50 },
  headerSection: { marginTop: 20, marginBottom: 18},
  titleRow: { flexDirection: "row", marginBottom: 15, marginLeft: 10, alignItems: "center" },
  backArrow: { fontSize: 24, marginLeft: 10, marginRight: 23, color: "#000" },
  headerTitle: { color: "#000", fontSize: 27, fontWeight: 500, marginRight: 10 },
  divider: { height: 1, backgroundColor: "#000", marginRight: 30, marginLeft: 10 },
  editBtnWrapper: { alignItems: "flex-end", marginBottom: 18 },
  editBtn: { backgroundColor: "#EEEEEE", paddingVertical: 3, paddingHorizontal: 8 },
  editBtnText: { fontSize: 18 },
  loader: { marginTop: 50 },
  bookGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  bookItemWrapper: {
    width: '33.3%',
    marginBottom: 20,
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    top: -5,
    right: 5,
    zIndex: 10,
    borderRadius: 11,
    color: 'black',
  },
  emptyText: {
    textAlign: 'center',
    width: '100%',
    marginTop: 20,
    color: '#888',
  },
});
