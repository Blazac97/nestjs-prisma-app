// Создаём сервис авторизации.
import { Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';
import { RegisterDto } from './dto/register.dto';
import { BcryptService } from '../../bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
// Создаём свойства и методы в классе сервиса.
@Injectable()
export class AuthService {
  constructor(
    private profilesService: ProfilesService,
    private bcrypt: BcryptService,
    private jwtService: JwtService
  ) {}

  // Метод для "подтверждения" юзера.
  async validateUser(email: string, password: string) {
    const userProfile = await this.profilesService.findOneByEmail(email);
    if (userProfile) {
      const { user, ...profileRest } = userProfile;
      const { password: userHashedPassword, ...userRest } = user!;
      const success = await this.bcrypt.compare(password, userHashedPassword);
      if (success) {
        return { ...profileRest, user: userRest };
      }
    }
    return null;
  }

  // Метод для регистрации юзера.
  async register(data: RegisterDto) {
    const createdProfile = await this.profilesService.create({
      name: data.name,
      lastName: data.name,
      address: data.address,
      phone: data.phone,
      user: {
        create: {
          email: data.email,
          password: await this.bcrypt.hash(data.password),
        },
      },
    });
    return this.login(createdProfile);
  }

  // Метод для "входа в систему" и выдачи JWT.
  async login(userProfile: any) {
    const payload = { sub: userProfile.user.id };
    return {
      profile: userProfile,
      access_token: this.jwtService.sign(payload),
    };
  }
}
