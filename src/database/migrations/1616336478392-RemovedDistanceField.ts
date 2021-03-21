import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedDistanceField1616336478392 implements MigrationInterface {
    name = 'RemovedDistanceField1616336478392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "distance"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "distance" numeric`);
    }

}
