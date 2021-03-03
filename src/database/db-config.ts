import { ConnectionOptions } from 'typeorm'
/**
 * DB configuration
 */

let ssl
if (process.env.DB_SSL === 'true') {
    ssl = {
        rejectUnauthorized: false
    }
} else { ssl = false }

const dbConfig: ConnectionOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl,
    entities:  ['**/*.entity.ts'],
    synchronize: false,
    migrations: ['migration/*.js', 'migration/*.ts'],
    subscribers: ['subscriber/*.js', 'subscriber/*.ts'],
    cli: {
        migrationsDir: 'migration',
        subscribersDir: 'server/subscriber'
    },
    maxQueryExecutionTime: 5000
    , logging: ['error']
}

export default dbConfig
