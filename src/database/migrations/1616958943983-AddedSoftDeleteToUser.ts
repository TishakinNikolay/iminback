import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddedSoftDeleteToUser1616958943983 implements MigrationInterface {
    name = 'AddedSoftDeleteToUser1616958943983';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    }

}
