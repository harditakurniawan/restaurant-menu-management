import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { clearIntegrationTestData } from './test-utils';
import { useContainer } from 'class-validator';
import { User } from '../src/database/entity/user.entity';
import { Role } from '../src/database/entity/role.entity';
import { Role as RoleEnum } from '../src/core/enum/role.enum';
import { AuthenticationService } from '../src/authentication/authentication.service';
import * as bcrypt from 'bcrypt';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AppConfig } from '../src/core/config/config';

describe('RestaurantController (e2e)', () => {
  let app: NestFastifyApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let createdRestaurantId: string;

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
    const authService = app.get(AuthenticationService);

    const roleRepo = dataSource.getRepository(Role);
    let adminRole = await roleRepo.findOne({ where: { name: RoleEnum.ADMIN }, relations: ['permissions'] });
    if (!adminRole) {
      adminRole = await roleRepo.save({ name: RoleEnum.ADMIN, permissions: [] });
    }

    const userRepo = dataSource.getRepository(User);
    let adminUser = await userRepo.findOne({ where: { email: 'integration-test-admin@example.com' } });
    if (!adminUser) {
      adminUser = await userRepo.save({
        email: 'integration-test-admin@example.com',
        name: 'Integration Test Admin',
        password: await bcrypt.hash('password123', 10),
        isActive: true,
        roles: [adminRole]
      });
    }

    adminToken = await authService.generateToken(adminUser);
    await authService.updateToken(adminUser, adminToken);
  });

  afterAll(async () => {
    await clearIntegrationTestData(dataSource);
    await app.close();
  });

  describe('/api/v1/restaurants (POST)', () => {
    it('should create a new restaurant', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'integration-test-restaurant-1',
          address: 'Integration Test Address',
          phone: '081234567890',
          opening_hour: '09:00 - 22:00',
        });

      expect(response.status).toBe(HttpStatus.CREATED);

      const getResponse = await request(app.getHttpServer())
        .get('/api/v1/restaurants')
        .expect(200);
      
      const found = getResponse.body.data.find((r: any) => r.name === 'integration-test-restaurant-1');
      expect(found).toBeDefined();
      createdRestaurantId = found.id;
    });
  });

  describe('/api/v1/restaurants (GET)', () => {
    it('should return a list of restaurants', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/restaurants')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.some((r: any) => r.name === 'integration-test-restaurant-1')).toBeTruthy();
    });
  });

  describe('/api/v1/restaurants/:id (PUT)', () => {
    it('should update an existing restaurant', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/restaurants/${createdRestaurantId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'integration-test-restaurant-updated',
          address: 'Integration Test Address Updated',
          phone: '081234567891',
          opening_hour: '10:00 - 22:00',
        });

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('/api/v1/restaurants/:id (DELETE)', () => {
    it('should delete a restaurant', async () => {
      const tempResponse = await request(app.getHttpServer())
        .post('/api/v1/restaurants')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'integration-test-restaurant-temp',
          address: 'Temp',
          phone: '081234567892',
          opening_hour: '09:00 - 22:00',
        });
      
      const listResponse = await request(app.getHttpServer()).get('/api/v1/restaurants');
      const tempId = listResponse.body.data.find((r: any) => r.name === 'integration-test-restaurant-temp').id;

      const deleteResponse = await request(app.getHttpServer())
        .delete(`/api/v1/restaurants/${tempId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(deleteResponse.status).toBe(HttpStatus.OK);
    });
  });
});
