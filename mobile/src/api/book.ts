import client from './client';

export const getBookDetail = async (bookId: string) => {
  const response = await client.get(`/book/${bookId}`); 
  return response.data;
}

export const searchBooks = async (query: string, target: string) => {
  const response = await client.get('/book', {
    params: { query, target }
  });
  return response.data;
}