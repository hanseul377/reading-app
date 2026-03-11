import client from './client';

// 1. 내 서재 목록 조회 (상태별 필터링 가능)
// 예: getUserBooks('READING') -> 읽고 있는 책만 가져옴
export const getUserBooks = async (status?: string) => {
  const response = await client.get('/user-books', {
    params: { status } // 쿼리 스트링으로 status 전달 (있을 때만 전달됨)
  });
  return response.data; // { books: [...] } 형태 반환
};

// 2. 내 서재에 책 추가
// bookData에는 isbn, title, author, publisher, description, coverImage, status가 포함되어야 함
export const addUserBook = async (bookData: any) => {
  const response = await client.post('/user-books', bookData);
  return response.data;
};

// 3. 독서 상태 변경 (읽기 전, 읽는 중, 읽음 등)
export const updateBookStatus = async (userBookId: number, status: string) => {
  const response = await client.patch(`/user-books/${userBookId}`, {
    status
  });
  return response.data;
};

// 4. 내 서재에서 책 삭제
export const deleteUserBook = async (userBookId: number) => {
  const response = await client.delete(`/user-books/${userBookId}`);
  return response.data; // 204 No Content인 경우 보통 undefined/empty
};