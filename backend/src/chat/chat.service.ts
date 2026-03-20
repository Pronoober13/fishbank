import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '../entities/chat-message.entity';
import { SendMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private chatRepository: Repository<ChatMessage>,
  ) {}

  private generateConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }

  async sendMessage(senderId: string, dto: SendMessageDto) {
    const conversationId = this.generateConversationId(senderId, dto.receiverId);
    const message = this.chatRepository.create({
      conversationId,
      senderId,
      receiverId: dto.receiverId,
      message: dto.message,
      productId: dto.productId,
    });
    return this.chatRepository.save(message);
  }

  async getConversations(userId: string) {
    // Get latest message from each conversation
    const conversations = await this.chatRepository
      .createQueryBuilder('msg')
      .where('msg.senderId = :userId OR msg.receiverId = :userId', { userId })
      .distinctOn(['msg.conversationId'])
      .orderBy('msg.conversationId')
      .addOrderBy('msg.createdAt', 'DESC')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.receiver', 'receiver')
      .getMany();

    return conversations;
  }

  async getMessages(userId: string, otherUserId: string, page = 1, limit = 50) {
    const conversationId = this.generateConversationId(userId, otherUserId);

    // Mark as read
    await this.chatRepository.update(
      { conversationId, receiverId: userId, isRead: false },
      { isRead: true },
    );

    const [data, total] = await this.chatRepository.findAndCount({
      where: { conversationId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data: data.reverse(), total, page, limit };
  }

  async getUnreadCount(userId: string) {
    const count = await this.chatRepository.count({
      where: { receiverId: userId, isRead: false },
    });
    return { unreadCount: count };
  }
}

