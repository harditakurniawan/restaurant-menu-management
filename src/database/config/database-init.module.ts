import { Module, Provider, Global } from '@nestjs/common';
import { Client } from 'pg';
import db_config from './db.config';

export const DatabaseInitProvider: Provider = {
  provide: 'DATABASE_INIT',
  useFactory: async () => {
    const config = db_config as any;
    const client = new Client({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
    });

    await client.connect();
    
    try {
      await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
      await client.query(`
        CREATE OR REPLACE FUNCTION uuid_generate_v7()
        RETURNS uuid AS $$
        DECLARE
          timestamp    timestamp with time zone = clock_timestamp();
          unix_ms      bigint;
          uuid_bytes   bytea;
        BEGIN
          unix_ms = (EXTRACT(EPOCH FROM timestamp) * 1000)::bigint;
          uuid_bytes = decode(lpad(to_hex(unix_ms), 12, '0'), 'hex') || gen_random_bytes(10);
          uuid_bytes = set_byte(uuid_bytes, 6, (get_byte(uuid_bytes, 6) & 15) | 112);
          uuid_bytes = set_byte(uuid_bytes, 8, (get_byte(uuid_bytes, 8) & 63) | 128);
          RETURN encode(uuid_bytes, 'hex')::uuid;
        END;
        $$ LANGUAGE plpgsql VOLATILE;
      `);
      console.log('UUID v7 function initialized successfully BEFORE TypeORM sync!');
    } catch (error) {
      console.error('Failed to initialize UUID v7 function before sync:', error);
    } finally {
      await client.end();
    }

    return true;
  },
};

@Global()
@Module({
  providers: [DatabaseInitProvider],
  exports: ['DATABASE_INIT'],
})
export class DatabaseInitModule {}
