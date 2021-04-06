import {MigrationInterface, QueryRunner} from 'typeorm';

export class ChangedEventReactionUserLookup1617330467873 implements MigrationInterface {
    name = 'ChangedEventReactionUserLookup1617330467873';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_379822c368ffa299f35ac314ff8"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_379822c368ffa299f35ac314ff8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_379822c368ffa299f35ac314ff8"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_379822c368ffa299f35ac314ff8" FOREIGN KEY ("userId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
