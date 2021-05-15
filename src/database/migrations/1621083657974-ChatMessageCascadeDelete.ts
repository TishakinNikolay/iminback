import {MigrationInterface, QueryRunner} from "typeorm";

export class ChatMessageCascadeDelete1621083657974 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05"`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05" FOREIGN KEY ("chatMemberId") REFERENCES "chat_member"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05"`);
    }

}
