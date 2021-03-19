import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventModule } from "../../event.module";
import { EventMemberRepository } from "./event-member.repository";
import { EventMemberService } from "./event-member.service";


@Module({
    providers: [
        EventMemberService
    ],
    imports: [
        forwardRef(() => EventModule),
        TypeOrmModule.forFeature([EventMemberRepository])
    ]
})
export class EventMemberModule {

}