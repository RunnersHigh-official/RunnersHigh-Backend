import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppLevelGuard } from '../auth/bearer-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/interface/user.interface';
import { CreateRunningRecordDto } from './dto/create-running-record.dto';
import { RunningService } from './running.service';

@ApiTags('Running')
@Controller('running')
export class RunningController {
  constructor(private readonly runningService: RunningService) {}

  @UseGuards(AppLevelGuard)
  @Post('record/:userId')
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: '러닝 기록 저장' })
  @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
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

  // @Get('records/:userId')
  // @ApiOperation({ summary: '사용자의 러닝 기록 목록 조회' })
  // @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  // @ApiQuery({ name: 'page', description: '페이지 번호', example: 1, required: false })
  // @ApiQuery({ name: 'limit', description: '페이지당 항목 수', example: 10, required: false })
  // @ApiResponse({
  //   status: 200,
  //   description: '러닝 기록 목록 조회 성공',
  //   schema: {
  //     example: {
  //       success: true,
  //       data: [
  //         {
  //           id: 1,
  //           distance: 0.02,
  //           targetDistance: 3.0,
  //           duration: 8,
  //           pace: '5:32',
  //           completionRate: 0.67,
  //           isCompleted: false,
  //           createdAt: '2025-01-19T10:00:10.000Z',
  //         },
  //       ],
  //       pagination: {
  //         page: 1,
  //         limit: 10,
  //         total: 1,
  //         totalPages: 1,
  //       },
  //     },
  //   },
  // })
  // async getUserRunningRecords(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Query('page') page = 1,
  //   @Query('limit') limit = 10,
  // ) {
  //   return this.runningService.getUserRunningRecords(userId, Number(page), Number(limit));
  // }

  // @Get('record/:id')
  // @ApiOperation({ summary: '특정 러닝 기록 상세 조회' })
  // @ApiParam({ name: 'id', description: '러닝 기록 ID', example: 1 })
  // @ApiResponse({
  //   status: 200,
  //   description: '러닝 기록 상세 조회 성공',
  //   schema: {
  //     example: {
  //       success: true,
  //       data: {
  //         id: 1,
  //         userId: 1,
  //         distance: 0.02,
  //         targetDistance: 3.0,
  //         duration: 8,
  //         pace: '5:32',
  //         calories: 15,
  //         startTime: '2025-01-19T10:00:00.000Z',
  //         endTime: '2025-01-19T10:00:08.000Z',
  //         averageHeartRate: 120,
  //         steps: 30,
  //         routeData: [
  //           { latitude: 37.5665, longitude: 126.9780, timestamp: '2025-01-19T10:00:00Z' }
  //         ],
  //         completionRate: 0.67,
  //         isCompleted: false,
  //         createdAt: '2025-01-19T10:00:10.000Z',
  //         user: {
  //           id: 1,
  //           name: 'User Name',
  //           nickname: 'Nickname',
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiResponse({ status: 404, description: '러닝 기록을 찾을 수 없습니다.' })
  // async getRunningRecordById(@Param('id', ParseIntPipe) id: number) {
  //   return this.runningService.getRunningRecordById(id);
  // }

  // @Get('stats/:userId')
  // @ApiOperation({ summary: '사용자의 러닝 통계 조회' })
  // @ApiParam({ name: 'userId', description: '사용자 ID', example: 1 })
  // @ApiResponse({
  //   status: 200,
  //   description: '러닝 통계 조회 성공',
  //   schema: {
  //     example: {
  //       success: true,
  //       data: {
  //         totalRuns: 10,
  //         totalDistance: 25.5,
  //         totalDuration: 7200,
  //         totalCalories: 1500,
  //         averageDistance: 2.55,
  //         averageCompletionRate: 85.5,
  //         completedRuns: 8,
  //         completionRate: 80.0,
  //       },
  //     },
  //   },
  // })
  // async getUserRunningStats(@Param('userId', ParseIntPipe) userId: number) {
  //   return this.runningService.getUserRunningStats(userId);
  // }
}
