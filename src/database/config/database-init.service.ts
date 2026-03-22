import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

      await queryRunner.query(`
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
      
      console.log('UUID v7 function initialized successfully');
    } catch (error) {
      console.error('Failed to initialize UUID v7 function:', error);
    } finally {
      await queryRunner.release();
    }
  }
}