import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import LibraryBookItem from "./LibraryBookItem";

interface LibrarySectionProps {
  title: string;
  books: any[];
  type: "wish" | "reading" | "finished";
  hideHeader?: boolean;
}

export default function LibrarySection({title,books, type, hideHeader = false}: LibrarySectionProps) {
  const navigation = useNavigation<any>();
  //const displayItems = [0, 1, 2]; // 책 세 칸으로 고정
  const previewBooks = books.slice(0, 4);

  return (
    <View style={styles.cardContainer}>
      {!hideHeader && (
        <>
          <TouchableOpacity 
            style={styles.header} 
            onPress={() => navigation.navigate("LibraryDetailScreen", { type: type })}
          >
            <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
            {/* 숫자 배지 추가 */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{books.length}</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>

          {/* <View style={styles.divider} /> */}
        </>
      )}

      <View style={styles.bookList}>
        {previewBooks.map((book) => (
          <TouchableOpacity 
            key={book.userBookId}
            style={styles.bookItemTouch} 
            onPress={() => {
              const cleanIsbn = book.isbn?.split(' ')[0];
              navigation.navigate("BookDetailScreen", { 
                bookId: cleanIsbn 
              });
              }}
            >
              <LibraryBookItem
                title={book.title}
                coverImage={book.coverImage}
                type={type}
              />
            </TouchableOpacity>
          ))}

          {books.length === 0 && (
          <Text style={styles.emptyText}>아직 담은 책이 없어요.</Text>
        )}

          {/* {previewBooks.length === 0 && (
            <Text style={{ color: '#888', marginLeft: 10 }}>아직 담은 책이 없어요.</Text>
          )}
          </View>
            {previewBooks.length === 3 && (
              <TouchableOpacity 
                style={styles.moreIcon}
                onPress={() => navigation.navigate("LibraryDetailScreen", { type: type })}
              >
                <Icon name="more-horiz" size={20} color="#888888" />
              </TouchableOpacity>
            )} */}
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24, // 시안처럼 아주 둥글게
    padding: 20,
    marginBottom: 20,
    // 그림자 (iOS)
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      // 그림자 (Android)
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    paddingVertical: 5,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#000",
    marginBottom: 13,
  },
  bookListWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  bookList: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
  },
  moreIcon: {
    position: 'absolute',
    right: -10,
    top: '35%', 
  },
  bookItemTouch: {
    width: '31%', 
    marginRight: '2%', 
  },
  badge: {
    backgroundColor: "#7E8341", // 올리브 그린 배지
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    marginVertical: 10,
  }
});