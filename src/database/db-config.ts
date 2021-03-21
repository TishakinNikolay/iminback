import { config } from 'dotenv';
import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
/**
 * DB configuration
 */
config();
let ssl;
if (process.env.DB_SSL === 'true') {
    ssl = {
        rejectUnauthorized: false
    };
} else { ssl = false; }

const dbConfig: ConnectionOptions = {
    type: 'postgres',
    url: 'postgres://ebhrqdgofumktk:4d975d322b0fd7020839c932996c0a7bb456264b1c80cbe0dd8062b460490785@ec2-34-252-251-16.eu-west-1.compute.amazonaws.com:5432/dbq6i3ps8a383l',
    ssl,
    entities: [join('build/', '**/', '*.entity.{ts,js}')],
    migrations: [join('build/', '**/', 'migrations/*.{ts,js}')],
    subscribers: ['subscriber/*.js', 'subscriber/*.ts'],
    cli: {
        migrationsDir: join('./src/database/migrations/'),
        subscribersDir: 'server/subscriber'
    },
    maxQueryExecutionTime: 5000
    , logging: ['error']
};

export default dbConfig;
