import { ApiProperty } from '@nestjs/swagger';
import { GoalType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRunningRecordDto {
  @ApiProperty({
    description: '러닝 제목',
    example: '아침 조깅',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '목표 타입',
    enum: GoalType,
    example: GoalType.DISTANCE,
  })
  @IsNotEmpty()
  @IsEnum(GoalType)
  goalType: GoalType;

  @ApiProperty({
    description: '실제 뛴 거리 (km)',
    example: 5.2,
  })
  @IsNotEmpty()
  @IsNumber()
  distance: number;

  @ApiProperty({
    description: '목표 거리 (km)',
    example: 3.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  targetDistance?: number;

  @ApiProperty({
    description: '러닝 시간 (초)',
    example: 1872,
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: '목표 시간 (초)',
    example: 1800,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  targetDuration?: number;

  @ApiProperty({
    description: '평균 페이스 (mm:ss/km 형식)',
    example: '5:32',
  })
  @IsNotEmpty()
  @IsString()
  pace: string;

  @ApiProperty({
    description: '소모 칼로리',
    example: 250,
  })
  @IsNotEmpty()
  @IsNumber()
  calories: number;

  @ApiProperty({
    description: '러닝 시작 시간',
    example: '2025-01-19T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: '러닝 종료 시간',
    example: '2025-01-19T10:00:08Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: '평균 심박수',
    example: 120,
  })
  @IsNotEmpty()
  @IsNumber()
  averageHeartRate: number;

  @ApiProperty({
    description: '최대 심박수',
    example: 150,
  })
  @IsNotEmpty()
  @IsNumber()
  maxHeartRate: number;

  @ApiProperty({
    description: '평균 케이던스 (분당 스텝 수)',
    example: 180,
  })
  @IsNotEmpty()
  @IsNumber()
  averageCadence: number;

  @ApiProperty({
    description: 'GPS 경로 데이터 (위도/경도 배열)',
    example: [
      {
        latitude: 37.5665,
        longitude: 126.978,
        timestamp: '2025-01-19T10:00:00Z',
      },
      {
        latitude: 37.5666,
        longitude: 126.9781,
        timestamp: '2025-01-19T10:00:04Z',
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  routeData: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;

  @ApiProperty({
    description: '목표 달성 여부',
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;
}
