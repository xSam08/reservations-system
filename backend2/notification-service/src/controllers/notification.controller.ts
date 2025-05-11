import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, InternalServerErrorException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole, Notification } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: any) {} // Replace 'any' with actual NotificationService once created

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Get all notifications (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all notifications' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return user notifications' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  findUserNotifications() {
    return this.notificationService.findUserNotifications();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return notification by ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.HOTEL_ADMIN)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Notification created successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  create(@Body() createNotificationDto: any) { // Replace 'any' with actual DTO
    return this.notificationService.create(createNotificationDto);
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notification marked as read' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiBearerAuth()
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notification deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }

  // Admin-only abort endpoint
  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiOperation({ summary: 'Abort notification service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiBearerAuth()
  abort() {
    // Simulate service failure
    throw new InternalServerErrorException('Notification service execution aborted by admin');
  }

  // Microservice message handlers
  @MessagePattern({ cmd: 'get_notification_by_id' })
  getNotificationById(id: string) {
    return this.notificationService.findOne(id);
  }

  @MessagePattern({ cmd: 'get_notifications_by_user' })
  getNotificationsByUser(userId: string) {
    return this.notificationService.findByUser(userId);
  }

  @MessagePattern({ cmd: 'create_notification' })
  createNotification(notificationData: any) {
    return this.notificationService.create(notificationData);
  }
}