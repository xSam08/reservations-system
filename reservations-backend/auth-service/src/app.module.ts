import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql-db',
      port: 3306,
      username: 'root',
      password: 'admin123',
      database: 'reservations',
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}