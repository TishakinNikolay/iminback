import {MigrationInterface, QueryRunner} from "typeorm";

export class CascadeDelete21619857431251 implements MigrationInterface {
    name = 'CascadeDelete21619857431251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_69d029e67ea56f5deecd76efc20"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_6a75057556437cd00f9b70cb221"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e4abcb418e46db776e920a05a16"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05"`);
        await queryRunner.query(`ALTER TABLE "chat_member" DROP CONSTRAINT "FK_0b7f67b9d8726c419922462e848"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_69d029e67ea56f5deecd76efc20" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_6a75057556437cd00f9b70cb221" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e4abcb418e46db776e920a05a16" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05" FOREIGN KEY ("chatMemberId") REFERENCES "chat_member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_member" ADD CONSTRAINT "FK_0b7f67b9d8726c419922462e848" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_member" DROP CONSTRAINT "FK_0b7f67b9d8726c419922462e848"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e4abcb418e46db776e920a05a16"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_6a75057556437cd00f9b70cb221"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_69d029e67ea56f5deecd76efc20"`);
        await queryRunner.query(`ALTER TABLE "chat_member" ADD CONSTRAINT "FK_0b7f67b9d8726c419922462e848" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05" FOREIGN KEY ("chatMemberId") REFERENCES "chat_member"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e4abcb418e46db776e920a05a16" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_6a75057556437cd00f9b70cb221" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_69d029e67ea56f5deecd76efc20" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
