import { ApiProperty } from '@nestjs/swagger';

export class UserSearchItemDto {
  @ApiProperty({ description: '유저 ID', example: 'user123456789' })
  id: string;

  @ApiProperty({ description: '유저 이름', example: '김러너' })
  name: string;

  @ApiProperty({ description: '닉네임', example: '러너123' })
  nickname: string;

  @ApiProperty({ description: '유저 코드', example: 'ABC123DE' })
  code: string;

  @ApiProperty({ description: '프로필 이미지 URL', example: 'https://example.com/profile.jpg', required: false })
  profileUrl?: string;
}

export class PaginationDto {
  @ApiProperty({ description: '현재 페이지', example: 1 })
  page: number;

  @ApiProperty({ description: '페이지당 항목 수', example: 10 })
  limit: number;

  @ApiProperty({ description: '총 항목 수', example: 1 })
  total: number;

  @ApiProperty({ description: '총 페이지 수', example: 1 })
  totalPages: number;
}

export class UserSearchResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: [UserSearchItemDto] })
  data: UserSearchItemDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}