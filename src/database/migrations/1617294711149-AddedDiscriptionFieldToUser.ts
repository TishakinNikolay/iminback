import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedDiscriptionFieldToUser1617294711149 implements MigrationInterface {
    name = 'AddedDiscriptionFieldToUser1617294711149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "description" character varying(1000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "description"`);
    }

}
