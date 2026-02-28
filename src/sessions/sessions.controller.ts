import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AddEventDto } from './dto/add-event.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  createSession(@Body() dto: CreateSessionDto) {
    return this.sessionsService.createSession(dto);
  }

  @Post(':sessionId/events')
  @HttpCode(HttpStatus.OK)
  addEvent(@Param('sessionId') sessionId: string, @Body() dto: AddEventDto) {
    return this.sessionsService.addEvent(sessionId, dto);
  }

  @Get(':sessionId')
  getSession(
    @Param('sessionId') sessionId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.sessionsService.getSession(sessionId, pagination);
  }

  @Post(':sessionId/complete')
  @HttpCode(HttpStatus.OK)
  completeSession(@Param('sessionId') sessionId: string) {
    return this.sessionsService.completeSession(sessionId);
  }
}
