import { Controller, Post, Get, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payment')
@Controller('api/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat Midtrans Snap token untuk order' })
  async createTransaction(@Param('orderId') orderId: string) {
    return this.paymentService.createTransaction(orderId);
  }

  @Post('notification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook notifikasi dari Midtrans' })
  async handleNotification(@Body() notification: any) {
    await this.paymentService.handleNotification(notification);
    return { status: 'ok' };
  }

  @Get('client-key')
  @ApiOperation({ summary: 'Get Midtrans client key untuk frontend' })
  getClientKey() {
    return { clientKey: this.paymentService.getClientKey() };
  }
}
