import express from "express";
import cors from "cors";
import authRoute from "./modules/auth/auth.route";
import userRoute from "./modules/user/user.route";
import userBooksRoute from "./modules/user-books/user-books.route";
import bookRoute from "./modules/book/book.route";
import reviewRoutes from './modules/review/review.routes';
import groupRoutes from './modules/group/group.routes';
import { group } from "node:console";

const app = express(); // 익스프레스 앱 생성
app.use(cors()); 
app.use(express.json());

// 경로 연결
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/user-books", userBooksRoute);
app.use("/book", bookRoute);
app.use('/reviews', reviewRoutes);
app.use('/groups', groupRoutes);

app.listen(8080, "0.0.0.0", () => {
  console.log("🚀 서버 실행 중...");
});