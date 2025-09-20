import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppLevelGuard } from '../auth/bearer-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/interface/user.interface';
import { UserSearchResponseDto } from './dto/user-search-response.dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth('access_token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AppLevelGuard)
  @Get('search')
  @ApiOperation({ summary: '유저 검색' })
  @ApiQuery({
    name: 'query',
    description: '검색어 (닉네임 또는 유저 코드)',
    example: '러너123',
    required: true,
  })
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
    description: '유저 검색 성공',
    type: UserSearchResponseDto,
  })
  @ApiResponse({ status: 400, description: '검색어가 필요합니다.' })
  async searchUsers(
    @CurrentUser() user: User,
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<UserSearchResponseDto> {
    return this.userService.searchUsers(user.id, query, Number(page), Number(limit));
  }
}