import { Controller, Post, Body, HttpStatus, Get, UseGuards, Req, Inject, Param, InternalServerErrorException, NotFoundException, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserRole } from '@app/shared';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly notificationServiceClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all notifications (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all notifications' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async findAll() {
    try {
      return firstValueFrom(
        this.notificationServiceClient.send({ cmd: 'findAll' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching notifications');
    }
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns user notifications' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findUserNotifications(@Req() req: any) {
    try {
      const userId = req.user.sub;
      
      return firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'findByUser' }, 
          { userId }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user notifications');
    }
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user unread notifications' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns unread notifications' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findUnreadNotifications(@Req() req: any) {
    try {
      const userId = req.user.sub;
      
      return firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'findUnreadByUser' }, 
          { userId }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error fetching unread notifications');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the notification' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const notification = await firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'findOne' }, 
          { id, userId, userRole }
        )
      );
      
      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      
      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching notification');
    }
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notification marked as read' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user.sub;
      const userRole = req.user.role;
      
      const notification = await firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'markAsRead' }, 
          { id, userId, userRole }
        )
      );
      
      if (!notification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      
      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error marking notification as read');
    }
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All notifications marked as read' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async markAllAsRead(@Req() req: any) {
    try {
      const userId = req.user.sub;
      
      return firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'markAllAsRead' }, 
          { userId }
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error marking all notifications as read');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_ADMIN, UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new notification (Admin only)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Notification created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async create(@Body() createNotificationDto: any) {
    try {
      return firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'create' }, 
          createNotificationDto
        )
      );
    } catch (error) {
      throw new InternalServerErrorException('Error creating notification');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a notification (Admin only)' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Notification deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Notification not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async delete(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.notificationServiceClient.send(
          { cmd: 'delete' }, 
          { id }
        )
      );
      
      if (!result) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
      }
      
      return { message: 'Notification deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting notification');
    }
  }

  @Post('abort')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SYSTEM_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abort notification service execution (Admin only)' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Service execution aborted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async abortNotificationService() {
    try {
      return firstValueFrom(
        this.notificationServiceClient.send({ cmd: 'abort' }, {})
      );
    } catch (error) {
      throw new InternalServerErrorException('Notification service execution aborted by admin');
    }
  }
}