import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { clearIntegrationTestData } from './test-utils';
import { useContainer } from 'class-validator';
import { Category } from '../src/database/entity/category.entity';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AppConfig } from '../src/core/config/config';

describe('CategoryController (e2e)', () => {
  let app: NestFastifyApplication;
  let dataSource: DataSource;
  let categoryRepo: any;

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
    categoryRepo = dataSource.getRepository(Category);

    await categoryRepo.save({
      name: 'integration-test-category',
      code: 'integration-test-code',
      ord: 999,
    });
  });

  afterAll(async () => {
    await clearIntegrationTestData(dataSource);
    await app.close();
  });

  describe('/api/v1/categories (GET)', () => {
    it('should return a list of categories including the integration-test one', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/categories')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBeTruthy();
      
      const found = response.body.data.find((c: any) => c.name === 'integration-test-category');
      expect(found).toBeDefined();
    });
  });
});
