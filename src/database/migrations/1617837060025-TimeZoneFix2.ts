import {MigrationInterface, QueryRunner} from "typeorm";

export class TimeZoneFix21617837060025 implements MigrationInterface {
    name = 'TimeZoneFix21617837060025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "applicationDate" TYPE TIMESTAMP(0) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "applicationDate" SET DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "approvalDate" TYPE TIMESTAMP(0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "approvalDate" TYPE TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "applicationDate" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "applicationDate" TYPE TIMESTAMP(6) WITH TIME ZONE`);
    }

}
