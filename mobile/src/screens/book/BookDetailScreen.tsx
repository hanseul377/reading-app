import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainLayout from "../../layouts/MainLayout";
import { Feather, Ionicons } from '@expo/vector-icons';
import client from "../../api/client";

interface BookDetailProps {
  status: "search" | "reading" | "finished";
}

export default function BookDetailScreen({ status = "search" }: BookDetailProps) {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { bookId } = route.params;

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(client.defaults.baseURL + `/book/${bookId}`);
        const data = await response.json();

        setBook(data); 
      } catch (err) {
        console.error("상세 데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetail();
  }, [bookId]);

  const handleSaveBook = async (targetStatus: string) => {
    if (!book) return;
    try {
      // 명세서에 맞춘 Request Body 구성
      const response = await fetch(client.defaults.baseURL + `/user-books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isbn: book.isbn,
          status: targetStatus, // 'WISH', 'READING', 'FINISHED'
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          coverImage: book.coverImage,
          description: book.description,
        }),
        
      });
      console.log("보내는 데이터:", book.isbn, targetStatus);

      if (response.status === 201 || response.status === 200) {
        Alert.alert("알림", "내 서재에 성공적으로 반영되었습니다.");
      } else {
        const errorData = await response.json();
        Alert.alert("오류", errorData.error || "저장에 실패했습니다.");
      }
    } catch (err) {
      console.error("저장 중 에러:", err);
      Alert.alert("오류", "서버와 연결할 수 없습니다.");
    }
  };
  const groupsWithThisBook = [
    { id: 1, name: "고전문학 읽기 모임", memberCount: 8 },
    { id: 2, name: "고전문학 읽기 모임", memberCount: 8 }
  ];

  const showGroupSelection = () => {
    // 💡 임시 데이터 (나중에 DB에서 내가 가입한 그룹 목록을 가져오면 됩니다!)
    

    Alert.alert(
      "그룹 선택",
      "어느 그룹 서재에 추가할까요?",
      [
        ...groupsWithThisBook.map(group => ({
          text: group.name,
          onPress: () => {
            console.log(`${group.name} 그룹 서재 추가 로직 실행`);
            // TODO: 그룹 추가 API 연결
            Alert.alert("성공", `${group.name} 서재에 추가되었습니다!`);
          }
        })),
        { text: "취소", style: "cancel" }
      ]
    );
  };

  const showSaveOptions = (targetStatus: string) => {
    Alert.alert(
      "책 추가하기",
      "어디에 추가하시겠습니까?",
      [
        { 
          text: "내 서재에 추가", 
          onPress: () => handleSaveBook(targetStatus) 
        },
        { 
          text: "그룹 서재에 추가", 
          onPress: () => showGroupSelection() 
        },
        { text: "취소", style: "cancel" }
      ]
    );
  };

  if (loading) {
    return (
      <MainLayout showHeader={true} showTabBar={true}>
        <ActivityIndicator size="large" color="#7E8341" style={{ flex: 1 }} />
      </MainLayout>
    );
  }

return (
    <MainLayout showHeader={true} showTabBar={true}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* 1. 헤더: 뒤로가기 + 타이틀 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>도서 정보</Text>
        </View>

        {/* 2. 도서 메인 정보 영역 (이미지 + 텍스트 + 버튼) */}
        <View style={styles.bookMainSection}>
          <View style={styles.coverWrapper}>
            {book?.coverImage ? (
              <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
            ) : (
              <View style={[styles.placeholderCover, { backgroundColor: '#A6AE7A' }]}>
                <Ionicons name="book-outline" size={40} color="#FFF" />
              </View>
            )}
          </View>

          <View style={styles.infoWrapper}>
            <Text style={styles.bookTitle} numberOfLines={1}>{book?.title || "제목"}</Text>
            <Text style={styles.bookSubText}>{book?.author || "저자"}</Text>
            <Text style={styles.bookSubText}>{book?.publisher || "출판사"}</Text>

            {/* 상태 버튼 리스트 */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleSaveBook("WISH")}>
                <Feather name="shopping-bag" size={22} color="#333" />
                <Text style={styles.actionLabel}>위시리스트에 담기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleSaveBook("READING")}>
                <Feather name="book-open" size={22} color="#333" />
                <Text style={styles.actionLabel}>읽고 있어요</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleSaveBook("FINISHED")}>
                <Feather name="award" size={22} color="#333" />
                <Text style={styles.actionLabel}>이미 읽었어요</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. 책 내용 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>책 내용</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {book?.description ? book.description : "책 상세 내용이 없습니다."}
            </Text>
          </View>
        </View>

        {/* 4. 이 책을 담은 그룹 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이 책을 담은 그룹</Text>
          {groupsWithThisBook.map((group) => (
            <TouchableOpacity key={group.id} style={styles.groupCard}>
              <Text style={styles.groupName}>{group.name}</Text>
              <View style={styles.memberBadge}>
                <Text style={styles.memberText}>{group.memberCount}명</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </MainLayout>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFDFD" },
  contentContainer: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  headerTitle: { fontSize: 22, fontWeight: "700", marginLeft: 15, color: "#333" },
  
  bookMainSection: { flexDirection: "row", marginBottom: 35 },
  coverWrapper: { width: 150, height: 210, marginRight: 20 },
  coverImage: { width: "100%", height: "100%", borderRadius: 8 },
  placeholderCover: { 
    width: "100%", height: "100%", borderRadius: 8, 
    justifyContent: 'center', alignItems: 'center' 
  },
  
  infoWrapper: { flex: 1, justifyContent: 'space-between' },
  bookTitle: { fontSize: 22, fontWeight: "700", color: "#333", marginBottom: 4 },
  bookSubText: { fontSize: 14, color: "#888", marginBottom: 2 },
  
  actionContainer: { marginTop: 10 },
  actionItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  actionLabel: { fontSize: 14, marginLeft: 10, color: "#555", fontWeight: '500' },

  section: { marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 15 },
  descriptionBox: { 
    backgroundColor: "#FFF", 
    padding: 18, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#F0F0F0',
    minHeight: 120 
  },
  descriptionText: { fontSize: 15, lineHeight: 22, color: "#666" },

  groupCard: {
    backgroundColor: "#FFF",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
      android: { elevation: 2 },
    }),
  },
  groupName: { fontSize: 16, fontWeight: '600', color: '#333' },
  memberBadge: { backgroundColor: '#F9F5E7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  memberText: { fontSize: 12, color: '#A6AE7A', fontWeight: '700' },
});