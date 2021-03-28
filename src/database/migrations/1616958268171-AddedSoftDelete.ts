import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedSoftDelete1616958268171 implements MigrationInterface {
    name = 'AddedSoftDelete1616958268171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "deletedAt"`);
    }

}
