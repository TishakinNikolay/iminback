import {MigrationInterface, QueryRunner} from "typeorm";

export class LeaveDateOnChatMember1620045703746 implements MigrationInterface {
    name = 'LeaveDateOnChatMember1620045703746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_member" ADD "leaveDate" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_member" DROP COLUMN "leaveDate"`);
    }

}
