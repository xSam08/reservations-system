import { IsEmail, IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED'
}

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsArray()
  attachments?: any[];
}

export class SendTestEmailDto {
  @IsEmail()
  to: string;

  @IsOptional()
  @IsString()
  subject?: string;
}

export class CreateEmailNotificationDto {
  @IsString()
  userId: string;

  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  data?: any;
}

export class EmailNotificationResponseDto {
  id: string;
  userId: string;
  to: string;
  subject: string;
  message: string;
  status: EmailStatus;
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}