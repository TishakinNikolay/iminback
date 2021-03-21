import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCategoryTable1616292209609 implements MigrationInterface {
    name = 'AddCategoryTable1616292209609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ADD "gender" "category_gender_enum" NOT NULL DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "gender"`);
    }

}
