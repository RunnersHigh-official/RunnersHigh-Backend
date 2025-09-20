import { ApiProperty } from '@nestjs/swagger';
import { GoalType } from '@prisma/client';
import { JsonArray } from '@prisma/client/runtime/library';

export class RunningRecordResponseDto {
  @ApiProperty({ description: '러닝 기록 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '러닝 제목', example: '아침 조깅' })
  title: string;

  @ApiProperty({
    description: '목표 타입',
    enum: GoalType,
    example: 'DISTANCE',
  })
  goalType: GoalType;

  @ApiProperty({
    description: '러닝 시작 시간',
    example: '2025-01-19T10:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: '러닝 종료 시간',
    example: '2025-01-19T10:31:12.000Z',
  })
  endTime: Date;

  @ApiProperty({ description: '러닝 시간 (초)', example: 1872 })
  duration: number;

  @ApiProperty({ description: '총 거리 (km)', example: 5.2 })
  totalDistance: number;

  @ApiProperty({ description: '목표 거리 (km)', example: 5.0 })
  targetDistance: number;

  @ApiProperty({ description: '평균 페이스', example: '6:00' })
  averagePace: string;

  @ApiProperty({ description: '소모 칼로리', example: 250 })
  calories: number;

  @ApiProperty({
    description: 'GPS 경로 데이터',
    example: [
      {
        latitude: 37.5665,
        longitude: 126.978,
        timestamp: '2025-01-19T10:00:00.000Z',
      },
    ],
  })
  routeData: JsonArray;

  @ApiProperty({ description: '평균 심박수', example: 120 })
  averageHeartRate: number;

  @ApiProperty({ description: '최대 심박수', example: 150 })
  maxHeartRate: number;

  @ApiProperty({ description: '평균 케이던스', example: 180 })
  averageCadence: number;

  @ApiProperty({ description: '목표 달성률 (%)', example: 104.0 })
  completionRate: number;

  @ApiProperty({ description: '목표 달성 여부', example: true })
  isCompleted: boolean;

  @ApiProperty({
    description: '생성 시간',
    example: '2025-01-19T10:00:10.000Z',
  })
  createdAt: Date;
}

export class RunningRecordDetailResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: RunningRecordResponseDto })
  data: RunningRecordResponseDto;
}

export class CreateRunningRecordResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '러닝 기록이 저장되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '생성된 러닝 기록 데이터',
    example: {
      id: 1,
      userId: '1',
      distance: 0.02,
      targetDistance: 3.0,
      duration: 8,
      pace: '5:32',
      calories: 15,
      startTime: '2025-01-19T10:00:00.000Z',
      endTime: '2025-01-19T10:00:08.000Z',
      completionRate: 0.67,
      isCompleted: false,
      createdAt: '2025-01-19T10:00:10.000Z',
    },
  })
  data: {
    id: number;
    userId: string;
    distance: number;
    targetDistance: number;
    duration: number;
    pace: string;
    calories: number;
    startTime: Date;
    endTime: Date;
    completionRate: number;
    isCompleted: boolean;
    createdAt: Date;
  };
}

export class RunningRecordListItemDto {
  @ApiProperty({ description: '러닝 기록 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '러닝 제목', example: '아침 조깅' })
  title: string;

  @ApiProperty({
    description: '러닝 시작 시간',
    example: '2025-01-19T10:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: '러닝 종료 시간',
    example: '2025-01-19T10:31:12.000Z',
  })
  endTime: Date;

  @ApiProperty({ description: '러닝 시간 (초)', example: 1872 })
  duration: number;

  @ApiProperty({ description: '총 거리 (km)', example: 5.2 })
  totalDistance: number;

  @ApiProperty({ description: '평균 페이스', example: '6:00' })
  averagePace: string;

  @ApiProperty({ description: '소모 칼로리', example: 250 })
  calories: number;

  @ApiProperty({ description: '평균 심박수', example: 120 })
  averageHeartRate: number;

  @ApiProperty({ description: '최대 심박수', example: 150 })
  maxHeartRate: number;

  @ApiProperty({ description: '평균 케이던스', example: 180 })
  averageCadence: number;

  @ApiProperty({
    description: '목표 타입',
    enum: GoalType,
    example: 'DISTANCE',
  })
  goalType: GoalType;

  @ApiProperty({ description: '목표 달성 여부', example: true })
  isCompleted: boolean;

  @ApiProperty({ description: '목표 달성률 (%)', example: 104.0 })
  completionRate: number;

  @ApiProperty({
    description: 'GPS 경로 데이터',
    example: [
      {
        latitude: 37.5665,
        longitude: 126.978,
        timestamp: '2025-01-19T10:00:00.000Z',
      },
    ],
  })
  routeData: JsonArray;
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

export class RunningRecordListResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({ type: [RunningRecordListItemDto] })
  data: RunningRecordListItemDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}

export class DeleteRunningRecordResponseDto {
  @ApiProperty({ description: '성공 여부', example: true })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '러닝 기록이 삭제되었습니다.',
  })
  message: string;
}
