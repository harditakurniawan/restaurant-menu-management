import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { clearIntegrationTestData } from './test-utils';
import { useContainer } from 'class-validator';
import { User } from '../src/database/entity/user.entity';
import { Role } from '../src/database/entity/role.entity';
import { Category } from '../src/database/entity/category.entity';
import { Restaurant } from '../src/database/entity/restaurant.entity';
import { Role as RoleEnum } from '../src/core/enum/role.enum';
import { AuthenticationService } from '../src/authentication/authentication.service';
import * as bcrypt from 'bcrypt';

import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { VersioningType } from '@nestjs/common';
import { AppConfig } from '../src/core/config/config';

describe('MenuItemController (e2e)', () => {
  let app: NestFastifyApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let restaurantId: string;
  let categoryId: string;
  let createdMenuItemId: string;

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
    let adminUser = await userRepo.findOne({ where: { email: 'integration-test-admin-menu@example.com' } });
    if (!adminUser) {
      adminUser = await userRepo.save({
        email: 'integration-test-admin-menu@example.com',
        name: 'Integration Test Admin Menu',
        password: await bcrypt.hash('password123', 10),
        isActive: true,
        roles: [adminRole]
      });
    }

    adminToken = await authService.generateToken(adminUser);
    await authService.updateToken(adminUser, adminToken);

    const categoryRepo = dataSource.getRepository(Category);
    const category = await categoryRepo.save({
      name: 'integration-test-category-menu',
      code: 'integration-test-code-menu',
      ord: 998,
    });
    categoryId = category.id;

    const restaurantRepo = dataSource.getRepository(Restaurant);
    const restaurant = await restaurantRepo.save({
      name: 'integration-test-restaurant-menu',
      address: 'Test Address',
      phone: '081234567899',
      opening_hour: '09:00 - 22:00',
    });
    restaurantId = restaurant.id;
  });

  afterAll(async () => {
    await clearIntegrationTestData(dataSource);
    await app.close();
  });

  describe('/api/v1/restaurants/:id/menu-items (POST)', () => {
    it('should create a new menu item for a restaurant', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/restaurants/${restaurantId}/menu-items`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'integration-test-menu-item-1',
          description: 'A delicious test item',
          price: 15000,
          is_available: true,
          category_id: categoryId,
        });

      expect(response.status).toBe(HttpStatus.CREATED);
      
      const getResponse = await request(app.getHttpServer())
        .get(`/api/v1/restaurants/${restaurantId}/menu-items`)
        .expect(200);

      const found = getResponse.body.data.find((m: any) => m.name === 'integration-test-menu-item-1');
      expect(found).toBeDefined();
      createdMenuItemId = found.id;
    });
  });

  describe('/api/v1/menu-items/:id (PUT)', () => {
    it('should update an existing menu item', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/menu-items/${createdMenuItemId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'integration-test-menu-item-updated',
          description: 'Updated description',
          price: 20000,
          is_available: false,
          category_id: categoryId,
          restaurant_id: restaurantId,
        });

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('/api/v1/menu-items/:id (DELETE)', () => {
    it('should delete a menu item', async () => {
      const tempResponse = await request(app.getHttpServer())
        .post(`/api/v1/restaurants/${restaurantId}/menu-items`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'integration-test-menu-item-temp',
          description: 'Temp',
          price: 10000,
          is_available: true,
          category_id: categoryId,
        });
      
      const getResponse = await request(app.getHttpServer())
        .get(`/api/v1/restaurants/${restaurantId}/menu-items`);
        
      const tempId = getResponse.body.data.find((m: any) => m.name === 'integration-test-menu-item-temp').id;

      const deleteResponse = await request(app.getHttpServer())
        .delete(`/api/v1/menu-items/${tempId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(deleteResponse.status).toBe(HttpStatus.OK);
    });
  });
});
