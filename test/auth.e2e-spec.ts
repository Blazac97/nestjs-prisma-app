import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Profile, User } from '@prisma/client';

import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { AppModule } from '../src/app/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { useContainer } from 'class-validator';

const getTestProfile = (): ProfileUser => ({
  id: 1,
  phone: '+8800999777',
  address: 'str. Lemonova',
  name: 'Igor',
  lastName: 'Igor',
  user: {
    id: 1,
    email: 'test@test.com',
    roles: [],
    profileId: 1,
    password: '$2a$15$/o0mkGz6YdPvX3uTa79imOXdauXPtuUKneAPQuDZF6ldY9p6F.6T.',
  },
});

type ProfileUser = Profile & {
  user: User;
};

describe('Auth', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();
    app = moduleRef.createNestApplication();

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: errors => new BadRequestException(errors),
      })
    );
    // https://stackoverflow.com/a/70913634
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.init();

    prisma = moduleRef.get(PrismaService);
  });

  it('POST /api/auth/register - успешная регистрация', () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.profile.create.mockResolvedValueOnce(getTestProfile());
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        phone: '+8800999777',
        address: 'str. Lemonova',
        name: 'Igor',
        lastName: 'Kartaus',
        password: '12345',
      })
      .expect(201)
      .then(res => {
        expect(res.body).toHaveProperty('profile');
        expect(res.body.profile).toHaveProperty('user');
        expect(res.body.profile.user).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('POST /api/auth/register - отсутствует необходимое поле phone', () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.profile.create.mockResolvedValueOnce(getTestProfile());
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        address: 'str. Lemonova',
        name: 'Igor',
        lastName: 'Kartaus',
        password: '12345',
      })
      .expect(400)
      .then(res => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message[0].property).toEqual('phone');
      });
  });

  it('POST /api/auth/register - такой email уже существует', () => {
    prisma.user.findUnique.mockResolvedValueOnce({} as any);
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.profile.create.mockResolvedValueOnce(getTestProfile());
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        phone: '+8800999777',
        address: 'str. Lemonova',
        name: 'Igor',
        lastName: 'Kartaus',
        password: '12345',
      })
      .expect(400)
      .then(res => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message[0].property).toEqual('email');
        expect(res.body.message[0].constraints.Unique).toEqual(
          'email entered is already in use.'
        );
      });
  });

  it('POST /api/auth/login - успешный вход', () => {
    prisma.profile.findFirst.mockResolvedValueOnce(getTestProfile());
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '12345',
      })
      .expect(201)
      .then(res => {
        expect(res.body).toHaveProperty('profile');
        expect(res.body.profile).toHaveProperty('user');
        expect(res.body.profile.user).not.toHaveProperty('password');
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('POST /api/auth/login - неуспешный вход (неправильный пароль)', () => {
    prisma.profile.findFirst.mockResolvedValueOnce(getTestProfile());
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(401)
      .then(res => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Unauthorized');
      });
  });

  it('POST /api/auth/login - неуспешный вход (несуществующий email)', () => {
    prisma.profile.findFirst.mockResolvedValueOnce(null);
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'test1@test.com',
        password: '12345',
      })
      .expect(401)
      .then(res => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Unauthorized');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
