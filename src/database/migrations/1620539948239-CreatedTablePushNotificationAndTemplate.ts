import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedTablePushNotificationAndTemplate1620539948239 implements MigrationInterface {
    name = 'CreatedTablePushNotificationAndTemplate1620539948239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "notification_template_name_enum" AS ENUM('CREATE_REQUEST_ON_JOIN_EVENT', 'USER_APPROVE_ON_EVENT', 'MEMBER_WITH_STATUS_APPLIED_GET_RENOUNCEMENT', 'MEMBER_WITH_STATUS_APPROVED_GET_RENOUNCEMENT', 'MEMBER_WITH_STATUS_APPROVED_RENOUNCEMENT_FROM_EVENT', 'MEMBER_WITH_STATUS_APPLIED_RENOUNCEMENT_FROM_EVENT', 'EDIT_DATA_EVENT', 'EDIT_DATE_EVENT', 'EDIT_TIME_EVENT', 'DELETE_EVENT', 'CUSTOM_NAME')`);
        await queryRunner.query(`CREATE TYPE "notification_template_notificationcategoryenum_enum" AS ENUM('EVENT')`);
        await queryRunner.query(`CREATE TABLE "notification_template" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "id" SERIAL NOT NULL, "title" character varying(350) NOT NULL, "message" character varying(5000) NOT NULL, "name" "notification_template_name_enum" NOT NULL, "notificationCategoryEnum" "notification_template_notificationcategoryenum_enum" NOT NULL, CONSTRAINT "PK_d2a6ef77141a01b8ac31f514cfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification" ("createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(), "id" SERIAL NOT NULL, "receiverId" integer NOT NULL, "eventId" integer, "parametersTemplate" jsonb NOT NULL, "notificationTemplateId" integer NOT NULL, "isSeen" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "pushNotificationToken" character varying(500)`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c744b340db3a34a8164fcfe84c8" FOREIGN KEY ("notificationTemplateId") REFERENCES "notification_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c744b340db3a34a8164fcfe84c8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pushNotificationToken"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "notification_template"`);
        await queryRunner.query(`DROP TYPE "notification_template_notificationcategoryenum_enum"`);
        await queryRunner.query(`DROP TYPE "notification_template_name_enum"`);
    }

}
