import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddedFieldCodeToTableUser1617229681169 implements MigrationInterface {
    name = 'AddedFieldCodeToTableUser1617229681169';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "code" character varying(500)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "code"`);
    }

}
