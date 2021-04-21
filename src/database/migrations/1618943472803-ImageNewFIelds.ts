import {MigrationInterface, QueryRunner} from "typeorm";

export class ImageNewFIelds1618943472803 implements MigrationInterface {
    name = 'ImageNewFIelds1618943472803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "isActive" boolean NOT NULL`);
        await queryRunner.query(`CREATE TYPE "image_theme_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "image" ADD "theme" "image_theme_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "image" ADD "externalId" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "image" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_05573b2e376bb14f5684f38171c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_05573b2e376bb14f5684f38171c"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "externalId"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "theme"`);
        await queryRunner.query(`DROP TYPE "image_theme_enum"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "isActive"`);
    }

}
