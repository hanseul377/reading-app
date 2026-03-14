import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import MainLayout from "../../layouts/MainLayout";
import Feather from '@expo/vector-icons/Feather';
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

  const showGroupSelection = () => {
    // 💡 임시 데이터 (나중에 DB에서 내가 가입한 그룹 목록을 가져오면 됩니다!)
    const myGroups = [
      { id: 1, name: "멋쟁이 사자들" },
      { id: 2, name: "알고리즘 스터디" }
    ];

    Alert.alert(
      "그룹 선택",
      "어느 그룹 서재에 추가할까요?",
      [
        ...myGroups.map(group => ({
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
      <MainLayout showHeader={false} showTabBar={false}>
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      </MainLayout>
    );
  }

  return (
    <MainLayout showHeader={false} showTabBar={false}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* 뒤로가기 및 타이틀 */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>{"←"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{"도서 정보"}</Text>
        </View>

        {/* 도서 메인 정보 영역 */}
        <View style={styles.bookMainInfo}>
          <View style={styles.coverWrapper}>
            {book?.coverImage ? (
              <Image source={{ uri: book.coverImage }} style={styles.coverImage} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderCover} />
            )}
          </View>

          {/* 텍스트 정보 (제목, 저자, 출판사) */}
          <View style={styles.textInfoWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              <View style={{ width: 300 }}>
                <Text style={styles.bookTitle} numberOfLines={2}>{book?.title || "제목"}</Text>
              </View>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              <Text style={styles.bookSubText}>{book?.author || "저자"}</Text>
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              <Text style={styles.bookSubText}>{book?.publisher || "출판사"}</Text>
            </ScrollView>

            {/* 상태 버튼들 */}
            <View style={styles.actionButtons}>
              {status === "search" && (
                <>
                  <TouchableOpacity style={styles.directButton} onPress={() => showSaveOptions("WISH")}>
                    <Feather name="shopping-bag" size={20} color="black" />
                    <Text style={styles.directButtonLabel}>위시리스트에 담기</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.directButton} onPress={() => handleSaveBook("READING")}>
                    <Feather name="book-open" size={20} color="black" />
                    <Text style={styles.directButtonLabel}>읽고 있어요</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.directButton} onPress={() => handleSaveBook("FINISHED")}>
                    <Feather name="bookmark" size={20} color="black" />
                    <Text style={styles.directButtonLabel}>이미 읽었어요</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>


        {/* 책 내용 섹션 */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>{"책 내용"}</Text>
  
          <View style={styles.descriptionBox}> 
            <ScrollView 
              style={{ flex: 1 }} 
              nestedScrollEnabled={true} 
              showsVerticalScrollIndicator={true} 
            >
              <Text style={styles.descriptionText}>
                {book?.description ? `${book.description}...` : "책 상세 내용이 없습니다."}
              </Text>
            </ScrollView>
          </View>
        </View>

      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  contentContainer: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 50 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 35 },
  backArrow: { fontSize: 26, marginRight: 20, color: "#000" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#000" },
  bookMainInfo: { flexDirection: "row", marginBottom: 20 },
  coverWrapper: { width: 140, height: 190, marginRight: 25 },
  coverImage: { width: "100%", height: "100%", borderRadius: 4 },
  placeholderCover: { width: "100%", height: "100%", backgroundColor: "#D9D9D9", borderRadius: 4 },
  textInfoWrapper: { flex: 1 },
  horizontalScroll: { marginBottom: 4 },
  bookTitle: { fontSize: 27, fontWeight: "bold", lineHeight: 34, marginBottom: 7, minWidth: 170 },
  bookSubText: { fontSize: 17, color: "#666", marginBottom: 7 },
  actionButtons: { marginTop: 15, gap: 12 },
  directButton: { flexDirection: "row", alignItems: "center", marginBottom: 9 },
  directButtonLabel: { fontSize: 18, marginLeft: 12, color: "#000" },
  descriptionSection: { marginTop: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  descriptionBox: { backgroundColor: "#F2F2F2", padding: 18, borderRadius: 8, minHeight: 200 },
  descriptionText: { fontSize: 17, lineHeight: 22, color: "#444" },
});