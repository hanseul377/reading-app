import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  const previewBooks = books.slice(0, 3);

  return (
    <View style={styles.container}>
      {!hideHeader && (
        <>
          <TouchableOpacity 
            style={styles.header} 
            onPress={() => navigation.navigate("LibraryDetailScreen", { type: type })}
          >
            <Text style={styles.title}>{title}</Text>
            <Icon name="chevron-right" size={20} color="#000" />
          </TouchableOpacity>

          <View style={styles.divider} />
        </>
      )}

      <View style={styles.bookListWrapper}>
        <View style={styles.bookList}>
          {previewBooks.map((book) => (
            <TouchableOpacity 
              key={book.userBookId}
              style={styles.bookItemTouch} 
              onPress={() => {
                const cleanIsbn = book.isbn.split(' ')[0];
                navigation.navigate("BookDetailScreen", { 
                  bookId: cleanIsbn 
                });
              }}
            >
              <LibraryBookItem
                title={book.title}
                coverImage={book.coverImage}
              />
            </TouchableOpacity>
          ))}

          {previewBooks.length === 0 && (
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
            )}
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    paddingVertical: 5,
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
});