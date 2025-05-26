import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class AppModule {}