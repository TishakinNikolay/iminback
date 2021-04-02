import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedEventReactionToPrimaryColumn1617381820486 implements MigrationInterface {
    name = 'ChangedEventReactionToPrimaryColumn1617381820486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_a98e3b6642c6cd2af63e72eff3c"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_32ff21cfc310a63c80b25796fc1" PRIMARY KEY ("userId", "eventId", "reactionType")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_32ff21cfc310a63c80b25796fc1"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_a98e3b6642c6cd2af63e72eff3c" PRIMARY KEY ("userId", "eventId")`);
    }

}
