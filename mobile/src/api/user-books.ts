import client from './client';

// 내 서재 목록 조회 
export const getUserBooks = async (status?: string) => {
  const response = await client.get('/user-books', {
    params: { status } 
  });
  return response.data;
};

// 내 서재에 책 추가
export const addUserBook = async (bookData: any) => {
  const response = await client.post('/user-books', bookData);
  return response.data;
};

// 독서 상태 변경 
export const updateBookStatus = async (userBookId: number, status: string) => {
  const response = await client.patch(`/user-books/${userBookId}`, {
    status
  });
  return response.data;
};

// 내 서재에서 책 삭제
export const deleteUserBook = async (userBookId: number) => {
  const response = await client.delete(`/user-books/${userBookId}`);
  return response.data; 
};