import {MigrationInterface, QueryRunner} from 'typeorm';

export class LocationManyToOne1617676095078 implements MigrationInterface {
    name = 'LocationManyToOne1617676095078';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_45e8e0655f148c8ae4dd9d0cc88"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "REL_45e8e0655f148c8ae4dd9d0cc8"`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_45e8e0655f148c8ae4dd9d0cc88" FOREIGN KEY ("eventLocationId") REFERENCES "event_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_45e8e0655f148c8ae4dd9d0cc88"`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "REL_45e8e0655f148c8ae4dd9d0cc8" UNIQUE ("eventLocationId")`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_45e8e0655f148c8ae4dd9d0cc88" FOREIGN KEY ("eventLocationId") REFERENCES "event_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
