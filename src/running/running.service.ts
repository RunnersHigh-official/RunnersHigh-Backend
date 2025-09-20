import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRunningRecordDto } from './dto/create-running-record.dto';

@Injectable()
export class RunningService {
  constructor(private readonly prisma: PrismaService) {}

  async createRunningRecord(userId: string, dto: CreateRunningRecordDto) {
    try {
      // 사용자 존재 확인
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // 달성률 계산
      const completionRate = dto.targetDistance
        ? Math.min((dto.distance / dto.targetDistance) * 100, 100)
        : 100;

      // 목표 달성 여부 계산
      const isCompleted = dto.targetDistance
        ? dto.distance >= dto.targetDistance
        : (dto.isCompleted ?? false);

      const runningRecord = await this.prisma.runningRecord.create({
        data: {
          userId: userId,
          title: dto.title,
          goalType: dto.goalType,
          distance: dto.distance,
          targetDistance: dto.targetDistance,
          duration: dto.duration,
          targetDuration: dto.targetDuration,
          pace: dto.pace,
          calories: dto.calories,
          startTime: new Date(dto.startTime),
          endTime: new Date(dto.endTime),
          averageHeartRate: dto.averageHeartRate,
          maxHeartRate: dto.maxHeartRate,
          averageCadence: dto.averageCadence,
          routeData: dto.routeData,
          completionRate,
          isCompleted,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              nickname: true,
            },
          },
        },
      });

      return {
        success: true,
        message: '러닝 기록이 저장되었습니다.',
        data: runningRecord,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create running record');
    }
  }

  async getUserRunningRecords(userId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [records, total] = await Promise.all([
        this.prisma.runningRecord.findMany({
          where: { userId },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.runningRecord.count({
          where: { userId },
        }),
      ]);

      // iOS 모델에 맞게 데이터 변환 (목록용 - 가벼운 버전)
      const transformedRecords = records.map((record) => ({
        id: record.id,
        title: record.title,
        startTime: record.startTime,
        endTime: record.endTime,
        duration: record.duration,
        totalDistance: record.distance,
        averagePace: record.pace,
        calories: record.calories,
        // 목록에서는 경로 데이터 제외 (상세 조회에서만 제공)
        averageHeartRate: record.averageHeartRate,
        maxHeartRate: record.maxHeartRate,
        averageCadence: record.averageCadence,
        // 목록에서 유용한 추가 정보
        goalType: record.goalType,
        isCompleted: record.isCompleted,
        completionRate: record.completionRate,
      }));

      return {
        success: true,
        data: transformedRecords,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch running records');
    }
  }

  async getRunningRecordById(id: number) {
    try {
      const record = await this.prisma.runningRecord.findUnique({
        where: { id },
      });

      if (!record) {
        throw new NotFoundException('Running record not found');
      }

      // iOS 모델에 맞게 데이터 변환 (상세 정보 포함)
      const transformedRecord = {
        id: record.id,
        title: record.title,
        startTime: record.startTime,
        endTime: record.endTime,
        duration: record.duration,
        totalDistance: record.distance,
        averagePace: record.pace,
        calories: record.calories,
        routePath: Array.isArray(record.routeData) ? record.routeData : [],
        averageHeartRate: record.averageHeartRate,
        maxHeartRate: record.maxHeartRate,
        averageCadence: record.averageCadence,
        // 추가 상세 정보
        goalType: record.goalType,
        targetDistance: record.targetDistance,
        targetDuration: record.targetDuration,
        completionRate: record.completionRate,
        isCompleted: record.isCompleted,
        createdAt: record.createdAt,
      };

      return {
        success: true,
        data: transformedRecord,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch running record');
    }
  }

  async getUserRunningStats(userId: string) {
    try {
      const stats = await this.prisma.runningRecord.aggregate({
        where: { userId },
        _sum: {
          distance: true,
          duration: true,
          calories: true,
        },
        _avg: {
          distance: true,
          completionRate: true,
        },
        _count: {
          id: true,
        },
      });

      const completedRuns = await this.prisma.runningRecord.count({
        where: {
          userId,
          isCompleted: true,
        },
      });

      return {
        success: true,
        data: {
          totalRuns: stats._count.id || 0,
          totalDistance: stats._sum.distance || 0,
          totalDuration: stats._sum.duration || 0,
          totalCalories: stats._sum.calories || 0,
          averageDistance: stats._avg.distance || 0,
          averageCompletionRate: stats._avg.completionRate || 0,
          completedRuns,
          completionRate: stats._count.id
            ? (completedRuns / stats._count.id) * 100
            : 0,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch running stats');
    }
  }

  async deleteRunningRecord(userId: string, recordId: number) {
    try {
      // 먼저 해당 기록이 존재하고 사용자 소유인지 확인
      const record = await this.prisma.runningRecord.findUnique({
        where: { id: recordId },
      });

      if (!record) {
        throw new NotFoundException('Running record not found');
      }

      if (record.userId !== userId) {
        throw new ForbiddenException('본인의 기록만 삭제할 수 있습니다.');
      }

      // 기록 삭제
      await this.prisma.runningRecord.delete({
        where: { id: recordId, userId: userId },
      });

      return {
        success: true,
        message: '러닝 기록이 삭제되었습니다.',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete running record');
    }
  }
}
