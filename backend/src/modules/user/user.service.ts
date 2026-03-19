import { prisma } from "../../config/prisma";

// 사용자 정보 조회 (GET)
export const getUserProfile = async (userId?: number) => {
  let user;

  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickname: true, profileImage: true, createdAt: true },
    });
  } else {
    // 💡 매개변수가 없으면 가장 먼저 가입한 유저 한 명을 가져옵니다.
    user = await prisma.user.findFirst({
      orderBy: { id: 'asc' },
      select: { id: true, email: true, nickname: true, profileImage: true, createdAt: true },
    });
  }
  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  //   select: {
  //     id: true,
  //     email: true,
  //     nickname: true,
  //     profileImage: true,
  //     createdAt: true,
  //   },
  // });

  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

//   const formattedGroups = user.groupMembers.map((gm) => ({
//     id: gm.group.id,
//     name: gm.group.name,
//     color: gm.group.color,
//     description: gm.group.description,
//   }));

//   const { groupMembers, ...userData } = user;

//   return {
//     ...userData,
//     groups: formattedGroups,
//   };
// };
};

// 사용자 정보 수정
export const updateUserProfile = async (
  userId: number,
  nickname?: string,
  profileImage?: string
) => {
  const updateData: any = {};

  if (nickname) updateData.nickname = nickname;
  if (profileImage) updateData.profileImage = profileImage;

  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};

// 회원 탈퇴
export const deleteUser = async (userId: number) => {
  await prisma.user.delete({
    where: { id: userId },
  });

  return { message: "탈퇴가 완료되었습니다." };
};