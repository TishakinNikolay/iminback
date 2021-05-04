import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedIsViewedAddedIsActive1620041475260 implements MigrationInterface {
    name = 'RemovedIsViewedAddedIsActive1620041475260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_message_view" DROP COLUMN "isViewed"`);
        await queryRunner.query(`ALTER TABLE "chat_member" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_member" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "chat_message_view" ADD "isViewed" boolean NOT NULL DEFAULT false`);
    }

}
