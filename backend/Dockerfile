FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# Prisma 스키마 복사 및 클라이언트 생성
COPY prisma ./prisma/
RUN npx prisma generate

# 전체 소스 코드 복사
COPY . .

# 빌드 (TypeScript인 경우)
RUN npm run build

EXPOSE 8080

# 실행 명령 (개발 시에는 nodemon 등을 사용하도록 설정 가능)
CMD ["npm", "run", "start"]