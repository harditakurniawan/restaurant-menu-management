import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { clearIntegrationTestData } from './test-utils';
import { useContainer } from 'class-validator';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AppConfig } from '../src/core/config/config';

describe('AuthenticationController (e2e)', () => {
  let app: NestFastifyApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix(AppConfig.APP_PREFIX);
    app.enableVersioning({ type: VersioningType.URI });
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await clearIntegrationTestData(dataSource);
    await app.close();
  });

  describe('/v1/auth/registration (POST)', () => {
    it('should successfully register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/registration')
        .send({
          email: 'integration-test-user@example.com',
          name: 'Integration Test User',
          password: 'password123',
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('integration-test-user@example.com');
    });

    it('should fail to register with the same email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/registration')
        .send({
          email: 'integration-test-user@example.com',
          name: 'Integration Test User 2',
          password: 'password123',
        });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/v1/auth/sign-in (POST)', () => {
    it('should successfully sign in the created user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/sign-in')
        .send({
          email: 'integration-test-user@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should fail to sign in with incorrect password', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/sign-in')
        .send({
          email: 'integration-test-user@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
