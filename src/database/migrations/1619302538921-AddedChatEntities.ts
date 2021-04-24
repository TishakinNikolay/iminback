import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedChatEntities1619302538921 implements MigrationInterface {
    name = 'AddedChatEntities1619302538921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "id" SERIAL NOT NULL, "eventId" integer NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "REL_2da3fbe6c6a8e663061a28cb9c" UNIQUE ("eventId"), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_message" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "id" SERIAL NOT NULL, "messageText" character varying(1000) NOT NULL, "chatMemberId" integer NOT NULL, "chatId" integer NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_3cc0d85193aade457d3077dd06b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_message_view" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "id" SERIAL NOT NULL, "isViewed" boolean NOT NULL DEFAULT false, "chatMemberId" integer NOT NULL, "chatMessageId" integer NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_75b3c25b79fd233ebc889c7b539" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP COLUMN "messageText"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP COLUMN "chatMemberId"`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD "messageText" character varying(1000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD "chatMemberId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_2da3fbe6c6a8e663061a28cb9cb" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_6d2db5b1118d92e561f5ebc1af0" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05" FOREIGN KEY ("chatMemberId") REFERENCES "chat_message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message_view" ADD CONSTRAINT "FK_c667044b7e4235132abe4a68b14" FOREIGN KEY ("chatMessageId") REFERENCES "chat_message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message_view" ADD CONSTRAINT "FK_384a39f174f6e858d2013417658" FOREIGN KEY ("chatMemberId") REFERENCES "chat_message"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD CONSTRAINT "FK_a44ec486210e6f8b4591776d6f3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_a44ec486210e6f8b4591776d6f3"`);
        await queryRunner.query(`ALTER TABLE "chat_message_view" DROP CONSTRAINT "FK_384a39f174f6e858d2013417658"`);
        await queryRunner.query(`ALTER TABLE "chat_message_view" DROP CONSTRAINT "FK_c667044b7e4235132abe4a68b14"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_97cae8378e50b3c0ad72dfd2d05"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP CONSTRAINT "FK_6d2db5b1118d92e561f5ebc1af0"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_2da3fbe6c6a8e663061a28cb9cb"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP COLUMN "chatMemberId"`);
        await queryRunner.query(`ALTER TABLE "chat_message" DROP COLUMN "messageText"`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD "chatMemberId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chat_message" ADD "messageText" character varying(1000) NOT NULL`);
        await queryRunner.query(`DROP TABLE "chat_message_view"`);
        await queryRunner.query(`DROP TABLE "chat_message"`);
        await queryRunner.query(`DROP TABLE "chat"`);
    }

}
