import { prisma } from "../../config/prisma";

// 책 정보 타입 정의
interface BookData {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  description?: string;
  coverImage?: string;
}

// 내 서재에 책 추가 서비스
export const addUserBook = async (userId: number, bookData: BookData, status: string) => {
  // Book 테이블에 이 책이 있는지 확인하고 없으면 생성 (upsert 활용)
  const book = await prisma.book.upsert({
    where: { isbn: bookData.isbn },
    update: {
      title: bookData.title, // 💡 혹시 모르니 업데이트 정보도 넣어주는 게 좋습니다.
      author: bookData.author,
      coverImage: bookData.coverImage,
    }, // 이미 존재한다면 정보를 유지함
    create: {
      isbn: bookData.isbn,
      title: bookData.title,
      author: bookData.author,
      publisher: bookData.publisher || "정보 없음",
      description: bookData.description || "",
      coverImage: bookData.coverImage || "",
    },
  });
  const confirmedBook = await prisma.book.findUnique({
    where: { isbn: bookData.isbn }
  });

  if (!confirmedBook) {
    throw new Error("책 데이터를 DB에서 찾을 수 없습니다.");
  }
  // 이미 서재에 있는 책인지 확인
  const existing = await prisma.readingStatus.findFirst({
    where: { userId: userId, bookId: confirmedBook.id },
  });

  //if (existing) throw new Error("이미 서재에 등록된 책입니다.");
  if (existing) {
    // 💡 [수정] 에러를 던지는 대신, 상태를 새로 입력받은 status로 업데이트합니다.
    return await prisma.readingStatus.update({
      where: { id: existing.id },
      data: { status },
    });
  }

  return await prisma.readingStatus.create({
    data: {
      userId: userId,
      bookId: confirmedBook.id,
      status: status, // 'WISH', 'READING', 'FINISHED'
    },
  });
};

// 독서 상태 변경 서비스
export const updateUserBookStatus = async (userBookId: number, status: string) => {
  return await prisma.readingStatus.update({
    where: { id: userBookId },
    data: { status },
  });
};

// 내 서재 목록 조회 (필터링 포함)
export const getUserBooks = async (userId: number, status?: string) => {
  const userBooks = await prisma.readingStatus.findMany({
    where: {
      userId,
      ...(status && { status }), // status가 있으면 필터링, 없으면 전체 조회
    },
    include: {
      book: true, 
    },
  });

  // 컨트롤러가 요구하는 JSON 형태로 변환
  return userBooks.map((record) => ({
    userBookId: record.id, // 책 관리용 ID
    bookId: record.bookId,
    isbn: record.book.isbn, // ISBN 정보. 프론트에서 필요할 수 있음
    title: record.book.title,
    author: record.book.author,
    publisher: record.book.publisher,
    description: record.book.description,
    coverImage: record.book.coverImage,
    status: record.status,
  }));
};

// 내 서재 책 삭제
export const deleteUserBook = async (userBookId: number) => {
  // 존재하는 데이터인지 먼저 확인 
  const existing = await prisma.readingStatus.findUnique({
    where: { id: userBookId },
  });

  if (!existing) throw new Error("삭제할 기록이 존재하지 않습니다.");

  return await prisma.readingStatus.delete({
    where: { id: userBookId },
  });
};