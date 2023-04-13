// Создаём JSON Web Token стратегию для авторизации пользователя на нашем сервере.
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtSecret } from '../constants';
import { ProfilesService } from '../../../modules/profiles/profiles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private profilesService: ProfilesService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Отключаем игнорирование "просроченного" токена доступа.
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const { sub } = payload;
    const profile = await this.profilesService.findOne({
      id: sub,
    });

    return { ...payload, ...profile };
  }
}
