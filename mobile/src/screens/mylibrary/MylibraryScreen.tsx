import React, { useEffect, useState } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import MainLayout from "../../layouts/MainLayout";
import LibrarySection from "../../components/library/LibrarySection";
import Search from "../../components/common/Search";
import client from "../../api/client";

// const API_URL = "http://192.168.132.1:3000/user-books";

export default function LibraryScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  // useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        setLoading(true);
        console.log("📡 전체 서재 목록 요청 시작...");

        // const response = await fetch(API_URL, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });

        const response = await client.get('/user-books');

        // 상태 코드 먼저 확인
        if (response.data?.books && Array.isArray(response.data.books)) {
        setBooks(response.data.books);
      } else {
        setBooks([]);
      }
    } catch (err: any) {
      console.error("❌ 전체 서재 로딩 실패:", err.response?.data || err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }

      //   // JSON 파싱
      //   const data = await response.json();
      //   console.log("서버 응답 데이터:", data);

      //   if (data?.books && Array.isArray(data.books)) {
      //     console.log("받아온 책 개수:", data.books.length);
      //     setBooks(data.books);
      //   } else {
      //     console.warn("books 필드가 없음 또는 배열 아님");
      //     setBooks([]);
      //   }
      // } catch (err) {
      //   console.error("전체 서재 로딩 실패:", err);
      // } finally {
      //   setLoading(false);
      //   console.log("--- API 호출 종료 ---");
      // }
    };

    //fetchAllBooks();
  //}, []);
  useEffect(() => {
    if (isFocused) {
      fetchAllBooks();
    }
  }, [isFocused]);

  return (
    <MainLayout>
      <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: 10 }}>
        <Search 
          placeholder="검색" 
          onPress={() => navigation.navigate("SearchScreen")} 
          editable={false} 
        />
      </View>

      <ScrollView style={{ flex: 1, paddingVertical: 35, paddingHorizontal: 26 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
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
          </>
        )}
      </ScrollView>
    </MainLayout>
  );
}
