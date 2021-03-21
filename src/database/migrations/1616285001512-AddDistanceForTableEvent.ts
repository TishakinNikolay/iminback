import {MigrationInterface, QueryRunner} from 'typeorm'

export class AddDistanceForTableEvent1616285001512 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."event" ADD "distance" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."event" DROP COLUMN "distance"`);
    }

}
