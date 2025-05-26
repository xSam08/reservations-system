import { IsOptional, IsString } from 'class-validator';

export class BasicDto {
  @IsOptional()
  @IsString()
  id?: string;
}

export * from './review.dto';
