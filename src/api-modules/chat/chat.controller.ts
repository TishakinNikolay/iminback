import {Controller, Get, Query, Request, UseGuards} from '@nestjs/common';
import {EventOwnerDto} from '../event/models/dto/request/event-owner.dto';
import {FavoriteEventsRequest} from '../event/models/dto/request/favorite/favorite-events-request.dto';
import {LocalGuard} from '../user/user-modules/auth/guards/local.guard';
import {ChatService} from './chat.service';

@Controller('/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    @Get('/')
    @UseGuards(LocalGuard)
    public async getUserChats(@Query() query,@Request() req) {
        const page = query.page;
        const pageSize = query.pageSize;
        const user =  req.user;
        return this.chatService.getUserChats(user, page,pageSize);
    }
}