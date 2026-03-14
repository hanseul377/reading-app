import { Request, Response } from "express";
import * as userService from "./user.service";

// 내 정보 조회 컨트롤러
export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ error: "로그인이 필요합니다." });
    }
    const userId = req.user.userId;
    const user = await userService.getUserProfile(userId);

    res.status(200).json({
      message: "내 정보 조회 성공",
      user,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 내 정보 수정 컨트롤러
export const updateMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.userId
    //const userId = 1; // 임시 ID
    // const userId = req.user.id; // 나중에 이 코드를 사용
    const currentUser = await userService.getUserProfile(userId);
    const { nickname, profileImage } = req.body;

    // 최소한 하나의 수정 데이터는 있어야 함
    if (!nickname && !profileImage) {
      return res.status(400).json({ error: "수정할 정보를 입력해주세요." });
    }

    const updatedUser = await userService.updateUserProfile(userId, nickname, profileImage);

    res.status(200).json({
      message: "정보 수정 완료",
      user: {
        id: updatedUser.id,
        nickname: updatedUser.nickname,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// 회원 탈퇴 컨트롤러
export const deleteMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "로그인이 필요합니다." });
    }
    const userId = req.user.userId;
    const result = await userService.deleteUser(userId);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};