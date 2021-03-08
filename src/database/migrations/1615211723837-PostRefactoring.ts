import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1615211723837 implements MigrationInterface {
    name = 'PostRefactoring1615211723837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5c0981de5dc2a2222a1f0574859"`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."profileImageId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_5c0981de5dc2a2222a1f057485"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5c0981de5dc2a2222a1f0574859" FOREIGN KEY ("profileImageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5c0981de5dc2a2222a1f0574859"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_5c0981de5dc2a2222a1f057485" UNIQUE ("profileImageId")`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."profileImageId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5c0981de5dc2a2222a1f0574859" FOREIGN KEY ("profileImageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
