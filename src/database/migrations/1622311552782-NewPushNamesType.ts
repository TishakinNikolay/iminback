import {MigrationInterface, QueryRunner} from "typeorm";

export class NewPushNamesType1622311552782 implements MigrationInterface {
    name = 'NewPushNamesType1622311552782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "notification_template_name_enum" RENAME TO "notification_template_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "notification_template_name_enum" AS ENUM('CREATE_REQUEST_ON_JOIN_EVENT', 'NEW_APPLICATION', 'APPLICATION_APPROVED', 'NEW_EVENT_MEMBER', 'APPLIED_MEMBER_BEEN_DECLINED', 'APPROVED_MEMBER_DECLINED', 'APPROVED_MEMBER_DECLINED_FOR_PARTICIPANTS', 'APPROVED_MEMBER_REFUSE', 'APPLICATION_REFUSE', 'EVENT_DETAILS_UPDATE', 'EVENT_DELETED', 'CUSTOM_NAME')`);
        await queryRunner.query(`ALTER TABLE "notification_template" ALTER COLUMN "name" TYPE "notification_template_name_enum" USING "name"::"text"::"notification_template_name_enum"`);
        await queryRunner.query(`DROP TYPE "notification_template_name_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "notification_template_name_enum_old" AS ENUM('CREATE_REQUEST_ON_JOIN_EVENT', 'USER_APPROVE_ON_EVENT', 'MEMBER_WITH_STATUS_APPLIED_GET_RENOUNCEMENT', 'MEMBER_WITH_STATUS_APPROVED_GET_RENOUNCEMENT', 'MEMBER_WITH_STATUS_APPROVED_RENOUNCEMENT_FROM_EVENT', 'MEMBER_WITH_STATUS_APPLIED_RENOUNCEMENT_FROM_EVENT', 'EDIT_DATA_EVENT', 'EDIT_DATE_EVENT', 'EDIT_TIME_EVENT', 'DELETE_EVENT', 'CUSTOM_NAME')`);
        await queryRunner.query(`ALTER TABLE "notification_template" ALTER COLUMN "name" TYPE "notification_template_name_enum_old" USING "name"::"text"::"notification_template_name_enum_old"`);
        await queryRunner.query(`DROP TYPE "notification_template_name_enum"`);
        await queryRunner.query(`ALTER TYPE "notification_template_name_enum_old" RENAME TO "notification_template_name_enum"`);
    }

}
