import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedIsActiveOrderNumberToCategory1619207274786 implements MigrationInterface {
    name = 'AddedIsActiveOrderNumberToCategory1619207274786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "category" ADD "orderNumber" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "orderNumber"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "isActive"`);
    }

}
