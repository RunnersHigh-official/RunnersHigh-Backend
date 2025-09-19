import {
  BadRequestException,
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
          userId,
          distance: dto.distance,
          targetDistance: dto.targetDistance,
          duration: dto.duration,
          pace: dto.pace,
          calories: dto.calories,
          startTime: new Date(dto.startTime),
          endTime: new Date(dto.endTime),
          averageHeartRate: dto.averageHeartRate,
          steps: dto.steps,
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
          include: {
            user: {
              select: {
                id: true,
                name: true,
                nickname: true,
              },
            },
          },
        }),
        this.prisma.runningRecord.count({
          where: { userId },
        }),
      ]);

      return {
        success: true,
        data: records,
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

      if (!record) {
        throw new NotFoundException('Running record not found');
      }

      return {
        success: true,
        data: record,
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
}
