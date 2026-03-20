import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole, ReportStatus } from '../common/enums';

@ApiTags('Admin')
@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard analytics' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  // Seller verification
  @Get('sellers/pending')
  @ApiOperation({ summary: 'Daftar seller menunggu verifikasi' })
  async getPendingSellers() {
    return this.adminService.getPendingSellers();
  }

  @Post('sellers/:userId/approve')
  @ApiOperation({ summary: 'Approve seller' })
  async approveSeller(@Request() req: any, @Param('userId') userId: string) {
    return this.adminService.approveSeller(userId, req.user.id);
  }

  @Post('sellers/:userId/reject')
  @ApiOperation({ summary: 'Reject seller' })
  async rejectSeller(@Request() req: any, @Param('userId') userId: string, @Body('reason') reason: string) {
    return this.adminService.rejectSeller(userId, req.user.id, reason);
  }

  // Product moderation
  @Get('products/pending')
  @ApiOperation({ summary: 'Daftar produk menunggu approval' })
  async getPendingProducts() {
    return this.adminService.getPendingProducts();
  }

  @Post('products/:productId/approve')
  @ApiOperation({ summary: 'Approve produk' })
  async approveProduct(@Request() req: any, @Param('productId') productId: string) {
    return this.adminService.approveProduct(productId, req.user.id);
  }

  @Post('products/:productId/reject')
  @ApiOperation({ summary: 'Reject produk' })
  async rejectProduct(@Request() req: any, @Param('productId') productId: string, @Body('reason') reason: string) {
    return this.adminService.rejectProduct(productId, req.user.id, reason);
  }

  // User management
  @Post('users/:userId/ban')
  @ApiOperation({ summary: 'Ban user' })
  async banUser(@Request() req: any, @Param('userId') userId: string, @Body('reason') reason: string) {
    return this.adminService.banUser(userId, req.user.id, reason);
  }

  @Post('users/:userId/unban')
  @ApiOperation({ summary: 'Unban user' })
  async unbanUser(@Request() req: any, @Param('userId') userId: string) {
    return this.adminService.unbanUser(userId, req.user.id);
  }

  // Reports
  @Post('reports/:reportId/resolve')
  @ApiOperation({ summary: 'Resolve laporan' })
  async resolveReport(
    @Request() req: any,
    @Param('reportId') reportId: string,
    @Body() body: { note: string; status: ReportStatus },
  ) {
    return this.adminService.resolveReport(reportId, req.user.id, body.note, body.status);
  }
}

