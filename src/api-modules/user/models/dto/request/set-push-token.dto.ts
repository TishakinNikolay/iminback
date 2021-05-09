import {IsNotEmpty} from "class-validator";

export class SetPushTokenDto {
    @IsNotEmpty()
    pushToken: string
}
