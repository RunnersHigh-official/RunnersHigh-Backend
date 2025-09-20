import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppLevelGuard } from '../auth/bearer-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/interface/user.interface';
import { CreateRunningRecordDto } from './dto/create-running-record.dto';
import { RunningService } from './running.service';

@ApiTags('Running')
@ApiBearerAuth('access_token')
@Controller('running')
export class RunningController {
  constructor(private readonly runningService: RunningService) {}

  @UseGuards(AppLevelGuard)
  @Put('record')
  @ApiOperation({ summary: '러닝 기록 저장' })
  @ApiResponse({
    status: 201,
    description: '러닝 기록이 성공적으로 저장되었습니다.',
    schema: {
      example: {
        success: true,
        message: '러닝 기록이 저장되었습니다.',
        data: {
          id: 1,
          userId: 1,
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
      },
    },
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  async createRunningRecord(
    @CurrentUser() user: User,
    @Body() dto: CreateRunningRecordDto,
  ) {
    return this.runningService.createRunningRecord(user.id, dto);
  }

  @UseGuards(AppLevelGuard)
  @Get('records')
  @ApiOperation({ summary: '사용자의 러닝 기록 목록 조회' })
  @ApiQuery({
    name: 'page',
    description: '페이지 번호',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: '페이지당 항목 수',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '러닝 기록 목록 조회 성공',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            title: '아침 조깅',
            startTime: '2025-01-19T10:00:00.000Z',
            endTime: '2025-01-19T10:31:12.000Z',
            duration: 1872,
            totalDistance: 5.2,
            averagePace: '6:00',
            calories: 250,
            averageHeartRate: 120,
            maxHeartRate: 150,
            averageCadence: 180,
            goalType: 'DISTANCE',
            isCompleted: true,
            completionRate: 104.0,
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async getUserRunningRecords(
    @CurrentUser() user: User,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.runningService.getUserRunningRecords(
      user.id,
      Number(page),
      Number(limit),
    );
  }

  @UseGuards(AppLevelGuard)
  @Get('record/:id')
  @ApiOperation({ summary: '특정 러닝 기록 상세 조회' })
  @ApiParam({ name: 'id', description: '러닝 기록 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '러닝 기록 상세 조회 성공',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          title: '아침 조깅',
          goalType: 'DISTANCE',
          startTime: '2025-01-19T10:00:00.000Z',
          endTime: '2025-01-19T10:31:12.000Z',
          duration: 1872,
          totalDistance: 5.2,
          targetDistance: 5.0,
          averagePace: '6:00',
          calories: 250,
          routeData: [
            {
              latitude: 37.5665,
              longitude: 126.978,
              timestamp: '2025-01-19T10:00:00.000Z',
            },
            {
              latitude: 37.5666,
              longitude: 126.9781,
              timestamp: '2025-01-19T10:00:04.000Z',
            },
          ],
          averageHeartRate: 120,
          maxHeartRate: 150,
          averageCadence: 180,
          completionRate: 104.0,
          isCompleted: true,
          createdAt: '2025-01-19T10:00:10.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '러닝 기록을 찾을 수 없습니다.' })
  async getRunningRecordById(@Param('id', ParseIntPipe) id: number) {
    return this.runningService.getRunningRecordById(id);
  }

  @UseGuards(AppLevelGuard)
  @Delete('record/:id')
  @ApiOperation({ summary: '러닝 기록 삭제' })
  @ApiParam({ name: 'id', description: '러닝 기록 ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: '러닝 기록이 성공적으로 삭제되었습니다.',
    schema: {
      example: {
        success: true,
        message: '러닝 기록이 삭제되었습니다.',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: '본인의 기록만 삭제할 수 있습니다.',
  })
  @ApiResponse({ status: 404, description: '러닝 기록을 찾을 수 없습니다.' })
  async deleteRunningRecord(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.runningService.deleteRunningRecord(user.id, id);
  }
}
