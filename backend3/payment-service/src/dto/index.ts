import { IsOptional, IsString } from 'class-validator';

export class BasicDto {
  @IsOptional()
  @IsString()
  id?: string;
}

// Service-specific DTOs will be added here
