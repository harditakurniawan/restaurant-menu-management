import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { SeederModule } from '@database/seeders/seeder.module';

async function bootstrap () {
    const app = await NestFactory.createApplicationContext(SeederModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal']
    });

    try {
        await app.select(CommandModule).get(CommandService) .exec();

        await app.close()
    } catch (error) {
        console.error('error run command', error.message);

        await app.close();

        process.exit(1);
    }
}

bootstrap();