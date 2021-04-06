import {MigrationInterface, QueryRunner} from 'typeorm';

export class geo1616336063974 implements MigrationInterface {
    name = 'geo1616336063974';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "approvalDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "approvalDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "declineDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "declineDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "declineDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "declineDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "approvalDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "approvalDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying(300)`);
    }

}
