import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddedGeoExtensions1615755788196 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION if not exists cube;`);
        await queryRunner.query(`CREATE EXTENSION if not exists earthdistance;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP EXTENSION cube;`);
        await queryRunner.query(`DROP EXTENSION earthdistance;`);
    }

}
