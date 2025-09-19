import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsDateString, IsArray, IsBoolean } from 'class-validator';

export class CreateRunningRecordDto {
  @ApiProperty({
    description: '실제 뛴 거리 (km)',
    example: 0.02,
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
    example: 8,
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: '평균 페이스 (mm:ss/km 형식)',
    example: '5:32',
    required: false,
  })
  @IsOptional()
  pace?: string;

  @ApiProperty({
    description: '소모 칼로리',
    example: 15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  calories?: number;

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
    required: false,
  })
  @IsOptional()
  @IsNumber()
  averageHeartRate?: number;

  @ApiProperty({
    description: '걸음 수',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  steps?: number;

  @ApiProperty({
    description: 'GPS 경로 데이터 (위도/경도 배열)',
    example: [
      { latitude: 37.5665, longitude: 126.9780, timestamp: '2025-01-19T10:00:00Z' },
      { latitude: 37.5666, longitude: 126.9781, timestamp: '2025-01-19T10:00:04Z' }
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  routeData?: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;

  @ApiProperty({
    description: '목표 달성 여부',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}