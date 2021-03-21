import {MigrationInterface, QueryRunner} from 'typeorm';

export class usernick1616007163892 implements MigrationInterface {
    name = 'usernick1616007163892';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "nickname" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "date" date NOT NULL`);
    }
}
