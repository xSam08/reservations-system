import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReviewController } from './controllers/review.controller';
import { ReviewService } from './services/review.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class AppModule {}