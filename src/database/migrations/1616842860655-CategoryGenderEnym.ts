import {MigrationInterface, QueryRunner} from "typeorm";

export class CategoryGenderEnym1616842860655 implements MigrationInterface {
    name = 'CategoryGenderEnym1616842860655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "distance"`);
        await queryRunner.query(`CREATE TYPE "category_gender_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "category" ADD "gender" "category_gender_enum" NOT NULL DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "category_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "distance" numeric`);
    }

}
