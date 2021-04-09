import {MigrationInterface, QueryRunner} from "typeorm";

export class TimeZoneWholeEntitesMove1617838123327 implements MigrationInterface {
    name = 'TimeZoneWholeEntitesMove1617838123327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "image" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "image" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "country" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "country" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "event_location" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event_location" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "event_location" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event_location" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "city" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "city" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "applicationDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "applicationDate" SET DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "approvalDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "approvalDate" TIMESTAMP(0) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "declineDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "declineDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "startTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "endTime" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "createdAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "endTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "startTime" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "createdAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD "createdAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "declineDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "declineDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "approvalDate"`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "approvalDate" TIMESTAMP(0)`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "applicationDate" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "applicationDate" TYPE TIMESTAMP(0) WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "city" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "city" ADD "createdAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_location" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event_location" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_location" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event_location" ADD "createdAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "country" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "country" ADD "createdAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "image" ADD "updatedAt" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "image" ADD "createdAt" TIMESTAMP DEFAULT now()`);
    }

}
