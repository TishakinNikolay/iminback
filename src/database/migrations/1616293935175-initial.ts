import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1616293935175 implements MigrationInterface {
    name = 'initial1616293935175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), "id" SERIAL NOT NULL, "uri" character varying(500) NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country" ("createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, CONSTRAINT "UQ_2c5aa339240c0c3ae97fcc9dc4c" UNIQUE ("name"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_location" ("createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), "id" SERIAL NOT NULL, "name" character varying(400) NOT NULL, "address" character varying(500) NOT NULL, "long" numeric NOT NULL, "lat" numeric NOT NULL, "cityId" integer NOT NULL, CONSTRAINT "PK_ff5c43e186f7faf15a975004d76" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), "id" SERIAL NOT NULL, "name" character varying(150) NOT NULL, "countryId" integer, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "event_member_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "event_member" ("userId" integer NOT NULL, "eventId" integer NOT NULL, "status" "event_member_status_enum" NOT NULL, "applicationDate" TIMESTAMP DEFAULT NOW(), "approvalDate" TIMESTAMP WITH TIME ZONE, "declineDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_bd7acfb10018a56de8c80239659" PRIMARY KEY ("userId", "eventId"))`);
        await queryRunner.query(`CREATE TYPE "event_reaction_reactiontype_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "event_reaction" ("createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), "userId" integer NOT NULL, "eventId" integer NOT NULL, "reactionType" "event_reaction_reactiontype_enum" NOT NULL, CONSTRAINT "PK_a98e3b6642c6cd2af63e72eff3c" PRIMARY KEY ("userId", "eventId"))`);
        await queryRunner.query(`CREATE TYPE "user_gender_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "user" ("createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), "id" SERIAL NOT NULL, "firstName" character varying(300) NOT NULL, "lastName" character varying(300) NOT NULL, "phone" character varying(25) NOT NULL, "dateOfBirth" TIMESTAMP WITH TIME ZONE, "gender" "user_gender_enum" NOT NULL, "email" character varying(300), "nickname" character varying(100) NOT NULL, "profileImageId" integer, "cityId" integer, CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), "id" SERIAL NOT NULL, "title" character varying(350) NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "description" character varying(5000) NOT NULL, "totalOfPersons" integer NOT NULL DEFAULT '0', "distance" numeric, "ownerId" integer, "imageId" integer, "eventLocationId" integer, CONSTRAINT "REL_45e8e0655f148c8ae4dd9d0cc8" UNIQUE ("eventLocationId"), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("createdAt" TIMESTAMP DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT NOW(), "id" SERIAL NOT NULL, "name" character varying(300) NOT NULL, "value" character varying(350) NOT NULL, "iconId" integer, CONSTRAINT "REL_6b1c6bc5c2fbba874342e58ba6" UNIQUE ("iconId"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_categories_category" ("eventId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_be85f4d4f79d2e4f53685ed7f96" PRIMARY KEY ("eventId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9fc5e5dab789917cc33940c08a" ON "event_categories_category" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c38526fad528c70c7c5baaa08" ON "event_categories_category" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "category_events_event" ("categoryId" integer NOT NULL, "eventId" integer NOT NULL, CONSTRAINT "PK_328e675814f9cbc0734af108542" PRIMARY KEY ("categoryId", "eventId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5ec511506f673c4d2f9e6a6581" ON "category_events_event" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_99ad0d8882edac5001e8fffaed" ON "category_events_event" ("eventId") `);
        await queryRunner.query(`ALTER TABLE "event_location" ADD CONSTRAINT "FK_62782a978bbb1966c2e203ec58c" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "city" ADD CONSTRAINT "FK_990b8a57ab901cb812e2b52fcf0" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_69d029e67ea56f5deecd76efc20" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_1791f560d1344e6c4ef3c64d2be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_6a75057556437cd00f9b70cb221" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_reaction" ADD CONSTRAINT "FK_379822c368ffa299f35ac314ff8" FOREIGN KEY ("userId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5c0981de5dc2a2222a1f0574859" FOREIGN KEY ("profileImageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_beb5846554bec348f6baf449e83" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_e4abcb418e46db776e920a05a16" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_66f2fc2fdf2751fd00dbb7bc5a6" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_45e8e0655f148c8ae4dd9d0cc88" FOREIGN KEY ("eventLocationId") REFERENCES "event_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_6b1c6bc5c2fbba874342e58ba67" FOREIGN KEY ("iconId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_categories_category" ADD CONSTRAINT "FK_9fc5e5dab789917cc33940c08a9" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_categories_category" ADD CONSTRAINT "FK_0c38526fad528c70c7c5baaa081" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_events_event" ADD CONSTRAINT "FK_5ec511506f673c4d2f9e6a65815" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_events_event" ADD CONSTRAINT "FK_99ad0d8882edac5001e8fffaed0" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_events_event" DROP CONSTRAINT "FK_99ad0d8882edac5001e8fffaed0"`);
        await queryRunner.query(`ALTER TABLE "category_events_event" DROP CONSTRAINT "FK_5ec511506f673c4d2f9e6a65815"`);
        await queryRunner.query(`ALTER TABLE "event_categories_category" DROP CONSTRAINT "FK_0c38526fad528c70c7c5baaa081"`);
        await queryRunner.query(`ALTER TABLE "event_categories_category" DROP CONSTRAINT "FK_9fc5e5dab789917cc33940c08a9"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_6b1c6bc5c2fbba874342e58ba67"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_45e8e0655f148c8ae4dd9d0cc88"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_66f2fc2fdf2751fd00dbb7bc5a6"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_e4abcb418e46db776e920a05a16"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_beb5846554bec348f6baf449e83"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5c0981de5dc2a2222a1f0574859"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_379822c368ffa299f35ac314ff8"`);
        await queryRunner.query(`ALTER TABLE "event_reaction" DROP CONSTRAINT "FK_6a75057556437cd00f9b70cb221"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_1791f560d1344e6c4ef3c64d2be"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_69d029e67ea56f5deecd76efc20"`);
        await queryRunner.query(`ALTER TABLE "city" DROP CONSTRAINT "FK_990b8a57ab901cb812e2b52fcf0"`);
        await queryRunner.query(`ALTER TABLE "event_location" DROP CONSTRAINT "FK_62782a978bbb1966c2e203ec58c"`);
        await queryRunner.query(`DROP INDEX "IDX_99ad0d8882edac5001e8fffaed"`);
        await queryRunner.query(`DROP INDEX "IDX_5ec511506f673c4d2f9e6a6581"`);
        await queryRunner.query(`DROP TABLE "category_events_event"`);
        await queryRunner.query(`DROP INDEX "IDX_0c38526fad528c70c7c5baaa08"`);
        await queryRunner.query(`DROP INDEX "IDX_9fc5e5dab789917cc33940c08a"`);
        await queryRunner.query(`DROP TABLE "event_categories_category"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_gender_enum"`);
        await queryRunner.query(`DROP TABLE "event_reaction"`);
        await queryRunner.query(`DROP TYPE "event_reaction_reactiontype_enum"`);
        await queryRunner.query(`DROP TABLE "event_member"`);
        await queryRunner.query(`DROP TYPE "event_member_status_enum"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "event_location"`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
