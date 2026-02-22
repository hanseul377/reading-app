import client from './client';

// 회원가입 요청 함수
export const signUp = async (userData: any) => {
  const response = await client.post('/auth/signup', userData);
  return response.data;
};

// 로그인 요청 함수
export const login = async (credentials: any) => {
  const response = await client.post('/auth/login', credentials);
  return response.data;
};