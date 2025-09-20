import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserSearchResponseDto } from './dto/user-search-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async searchUsers(currentUserId: string, query: string, page: number = 1, limit: number = 10): Promise<UserSearchResponseDto> {
    if (!query || query.trim().length === 0) {
      throw new Error('검색어가 필요합니다.');
    }

    const skip = (page - 1) * limit;

    const whereCondition = {
      AND: [
        {
          id: {
            not: currentUserId, // 자기 자신 제외
          },
        },
        {
          OR: [
            {
              nickname: {
                contains: query,
              },
            },
            {
              code: {
                equals: query,
              },
            },
          ],
        },
      ],
    };

    // 정확도 순으로 정렬: 코드 완전 일치 > 닉네임 완전 일치 > 닉네임 부분 일치
    const [exactCodeMatch, exactNicknameMatch, partialNicknameMatch, total] = await Promise.all([
      // 1. 코드 완전 일치
      this.prisma.user.findMany({
        where: {
          AND: [
            { id: { not: currentUserId } },
            { code: { equals: query } },
          ],
        },
        select: { id: true, name: true, nickname: true, code: true, profileUrl: true },
      }),
      // 2. 닉네임 완전 일치
      this.prisma.user.findMany({
        where: {
          AND: [
            { id: { not: currentUserId } },
            { nickname: { equals: query } },
          ],
        },
        select: { id: true, name: true, nickname: true, code: true, profileUrl: true },
      }),
      // 3. 닉네임 부분 일치
      this.prisma.user.findMany({
        where: {
          AND: [
            { id: { not: currentUserId } },
            { nickname: { contains: query } },
            { nickname: { not: query } }, // 완전 일치 제외
          ],
        },
        select: { id: true, name: true, nickname: true, code: true, profileUrl: true },
      }),
      this.prisma.user.count({ where: whereCondition }),
    ]);

    // 중복 제거 및 정확도 순 정렬
    const allUsers = [...exactCodeMatch, ...exactNicknameMatch, ...partialNicknameMatch];
    const uniqueUsers = allUsers.filter((user, index, self) =>
      index === self.findIndex(u => u.id === user.id)
    );

    // 페이지네이션 적용
    const users = uniqueUsers.slice(skip, skip + limit);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: users.map(user => ({
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        code: user.code,
        profileUrl: user.profileUrl,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}