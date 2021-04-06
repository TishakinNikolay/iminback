import {MigrationInterface, QueryRunner} from 'typeorm';

export class AfterFixes1617651596893 implements MigrationInterface {
    name = 'AfterFixes1617651596893';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_32ff21cfc310a63c80b25796fc1"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_eacfee36c340ae968e7ea47f7dc" PRIMARY KEY ("userId", "eventId", "reactionType", "id")`);
        await queryRunner.query(`ALTER TABLE "event_location" ADD CONSTRAINT "UQ_26fe3558c4a69830968ae83996e" UNIQUE ("address")`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_379822c368ffa299f35ac314ff8"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_6a75057556437cd00f9b70cb221"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_eacfee36c340ae968e7ea47f7dc"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_1df31551128f3559f725a15176f" PRIMARY KEY ("eventId", "reactionType", "id")`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_1df31551128f3559f725a15176f"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_92ce2131d1ca5dfeea6efa00920" PRIMARY KEY ("reactionType", "id")`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_92ce2131d1ca5dfeea6efa00920"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_0da5889620fafdd724f6fb9a5d9" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_6a75057556437cd00f9b70cb221" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_379822c368ffa299f35ac314ff8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_379822c368ffa299f35ac314ff8"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_6a75057556437cd00f9b70cb221"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_0da5889620fafdd724f6fb9a5d9"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_92ce2131d1ca5dfeea6efa00920" PRIMARY KEY ("reactionType", "id")`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_92ce2131d1ca5dfeea6efa00920"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_1df31551128f3559f725a15176f" PRIMARY KEY ("eventId", "reactionType", "id")`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_1df31551128f3559f725a15176f"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_eacfee36c340ae968e7ea47f7dc" PRIMARY KEY ("userId", "eventId", "reactionType", "id")`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_6a75057556437cd00f9b70cb221" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_379822c368ffa299f35ac314ff8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_location" DROP CONSTRAINT "UQ_26fe3558c4a69830968ae83996e"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "PK_eacfee36c340ae968e7ea47f7dc"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "PK_32ff21cfc310a63c80b25796fc1" PRIMARY KEY ("userId", "eventId", "reactionType")`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP COLUMN "id"`);
    }

}
