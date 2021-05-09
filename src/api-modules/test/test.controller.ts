import {Body, Controller, Post} from "@nestjs/common";

@Controller('test')
export class TestController {
    @Post('notification')
    public async testNotification(@Body('token') token: string) {
        console.log(token)
    }
}
