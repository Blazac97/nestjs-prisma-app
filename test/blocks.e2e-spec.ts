import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Block, Profile, Role, User } from '@prisma/client';

import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { AppModule } from '../src/app/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { useContainer } from 'class-validator';
import { AuthService } from '../src/modules/auth/auth.service';

const getTestProfileAdmin = (): ProfileUser => ({
  id: 1,
  phone: '+8800999777',
  address: 'str. Lemonova',
  name: 'Igor',
  lastName: 'Igor',
  user: {
    id: 1,
    email: 'test@test.com',
    roles: [Role.ADMIN],
    profileId: 1,
    password: '$2a$15$/o0mkGz6YdPvX3uTa79imOXdauXPtuUKneAPQuDZF6ldY9p6F.6T.',
  },
});
const getTestProfileUser = (): ProfileUser => ({
  id: 1,
  phone: '+8800999777',
  address: 'str. Lemonova',
  name: 'Igor',
  lastName: 'Igor',
  user: {
    id: 1,
    email: 'test@test.com',
    roles: [Role.USER],
    profileId: 1,
    password: '$2a$15$/o0mkGz6YdPvX3uTa79imOXdauXPtuUKneAPQuDZF6ldY9p6F.6T.',
  },
});

const getTestBlock = (): Block & {
  picture: File | null;
} => ({
  id: 1,
  key: 'test-123',
  name: 'test-123',
  content: 'test-123',
  group: 'test-123',
  pictureId: null,
  picture: null,
});

type ProfileUser = Profile & {
  user: User;
};

describe('Blocks', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let authService: AuthService;
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
    authService = moduleRef.get(AuthService);
  });

  it('POST /api/blocks - успешное создание блока', async () => {
    prisma.profile.findUnique.mockResolvedValueOnce(getTestProfileAdmin());
    prisma.user.findFirst.mockResolvedValueOnce(getTestProfileAdmin().user);
    prisma.block.create.mockResolvedValueOnce(getTestBlock());

    const { access_token } = await authService.login(getTestProfileAdmin());

    prisma.profile.create.mockResolvedValueOnce(getTestProfileAdmin());
    return request(app.getHttpServer())
      .post('/api/blocks')
      .set('Authorization', 'Bearer ' + access_token)
      .field('key', 'test-123')
      .field('content', 'test-123')
      .field('name', 'test-123')
      .field('group', 'test-123')
      .expect(201)
      .then(res => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('key');
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('content');
        expect(res.body).toHaveProperty('group');
        expect(res.body).toHaveProperty('pictureId');
        expect(res.body).toHaveProperty('picture');
      });
  });

  it('POST /api/blocks - неуспешное создание блока: отсутствие необходимых полей', async () => {
    prisma.profile.findUnique.mockResolvedValueOnce(getTestProfileAdmin());
    prisma.user.findFirst.mockResolvedValueOnce(getTestProfileAdmin().user);
    prisma.block.create.mockResolvedValueOnce(getTestBlock());

    const { access_token } = await authService.login(getTestProfileAdmin());

    prisma.profile.create.mockResolvedValueOnce(getTestProfileAdmin());
    return request(app.getHttpServer())
      .post('/api/blocks')
      .set('Authorization', 'Bearer ' + access_token)
      .field('key', 'test-123')
      .field('name', 'test-123')
      .field('group', 'test-123')
      .expect(400)
      .then(res => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message[0].property).toEqual('content');
        expect(res.body.message[0].constraints.isNotEmpty).toEqual(
          'content should not be empty'
        );
      });
  });

  it('POST /api/blocks - неуспешное создание блока: не авторизован', async () => {
    return request(app.getHttpServer())
      .post('/api/blocks')
      .field('key', 'test-123')
      .field('name', 'test-123')
      .field('content', 'test-123')
      .field('group', 'test-123')
      .expect(401)
      .then(res => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Unauthorized');
      });
  });

  it('POST /api/blocks - неуспешное создание блока: не админ', async () => {
    prisma.profile.findUnique.mockResolvedValueOnce(getTestProfileUser());
    prisma.user.findFirst.mockResolvedValueOnce(getTestProfileUser().user);
    prisma.block.create.mockResolvedValueOnce(getTestBlock());

    const { access_token } = await authService.login(getTestProfileUser());

    prisma.profile.create.mockResolvedValueOnce(getTestProfileUser());

    return request(app.getHttpServer())
      .post('/api/blocks')
      .set('Authorization', 'Bearer ' + access_token)
      .field('key', 'test-123')
      .field('name', 'test-123')
      .field('content', 'test-123')
      .field('group', 'test-123')
      .expect(403)
      .then(res => {
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('error');
        expect(res.body.message).toEqual('Forbidden resource');
        expect(res.body.error).toEqual('Forbidden');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
