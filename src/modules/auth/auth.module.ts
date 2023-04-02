// Создаём модуль авторизации.
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ProfilesModule,
    PassportModule,
    // Конфигурируем JWT модуль. Токен будет жить 12 часов.
    JwtModule.register({ secret: jwtSecret, signOptions: { expiresIn: '12h' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
