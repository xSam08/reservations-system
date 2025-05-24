import { IsNotEmpty, IsEnum, IsString, IsOptional, IsBoolean } from 'class-validator';
import { NotificationType } from '../enums';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  data?: any;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class NotificationResponseDto {
  notificationId: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}