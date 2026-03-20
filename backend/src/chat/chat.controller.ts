import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@Controller('api/chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Kirim pesan' })
  async sendMessage(@Request() req: any, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.id, dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Daftar percakapan' })
  async getConversations(@Request() req: any) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('messages/:otherUserId')
  @ApiOperation({ summary: 'Riwayat pesan dengan user lain' })
  async getMessages(
    @Request() req: any,
    @Param('otherUserId') otherUserId: string,
    @Query('page') page?: number,
  ) {
    return this.chatService.getMessages(req.user.id, otherUserId, page);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Jumlah pesan belum dibaca' })
  async getUnreadCount(@Request() req: any) {
    return this.chatService.getUnreadCount(req.user.id);
  }
}

