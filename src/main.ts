import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppConfig } from '@core-config/config';
import { Environment } from '@core-enum/environment.enum';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { WriteLogMiddleware } from '@core-logging/log.middleware';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ResponseTransformInterceptor } from '@core-interceptors/response-transform.interceotor';
import { useContainer } from 'class-validator';
import { RolesGuard } from '@core-guards/roles.guard';
import { FastifyInstance } from 'fastify';
import { contentParser } from 'fastify-multer';
import { join } from 'path';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger              = new Logger('Bootstrap');
  const appName             = AppConfig.APP_NAME;
  const rootFolder          = AppConfig.APP_ROOT_FOLDER;
  const prefix              = AppConfig.APP_PREFIX;
  const port                = AppConfig.APP_PORT || 3000;
  const isProductionMode    = AppConfig.APP_MODE === Environment.PROD;
  const app                 = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { rawBody: true });

  /**
   * Write global log middleware
   */
  const fastifyInstance = app.getHttpAdapter().getInstance() as FastifyInstance;
  fastifyInstance.addHook('onResponse', async (req, res) => {
    WriteLogMiddleware(req, res)
  });
  
  app.enableCors();
  app.setGlobalPrefix(prefix);
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });  // Init custom validator
  app.useGlobalGuards(new RolesGuard(new Reflector()));             // Declare global guard to be able to access from any module.

  fastifyInstance.register(contentParser);
  app.useStaticAssets({
    root: join(__dirname, `../../${rootFolder}`),
  });

  /**
   * Declare helmet
   */
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        imgSrc      : [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
        scriptSrc   : [`'self'`, `https: 'unsafe-inline'`],
        manifestSrc : [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
        frameSrc    : [`'self'`, 'sandbox.embed.apollographql.com'],
      },
    },
  }));

  /**
   * Declare Swagger Config
   */
  if (!isProductionMode) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(`${appName} - API Documentation`)
      .setDescription('This documentation contain all endpoint specification')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'please enter jwt token',
          in: 'header',
        },
        'Authentication - Bearer jwt_token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    });
  }

  await app.listen(port, '0.0.0.0');
  logger.log(`DATABASE CONNECTED & APP RUNNING ON ${port}`);
}
bootstrap();
