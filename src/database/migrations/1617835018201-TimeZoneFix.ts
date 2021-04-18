import {MigrationInterface, QueryRunner} from 'typeorm';

export class TimeZoneFix1617835018201 implements MigrationInterface {
    name = 'TimeZoneFix1617835018201';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "applicationDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "applicationDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "applicationDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "applicationDate" TIMESTAMP DEFAULT now()`);
    }

}
