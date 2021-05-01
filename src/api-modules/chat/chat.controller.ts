import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
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
    @Post('/message')
    @UseGuards(LocalGuard)
    public async postMessage(@Body('text') text: string, @Body('chatId') chatId: number, @Request() req) {
        const user = req.user;
        return this.chatService.postMessage(user, chatId, text);

    }
    @Delete('/message/:messageId')
    @UseGuards(LocalGuard)
    public async deleteMessage(@Param('messageId') messageId: number) {
        return this.chatService.deleteMessage(messageId);

    }
    @Put('/message/:messageId')
    @UseGuards(LocalGuard)
    public async updateMessage(@Param('messageId') messageId: number, @Body('text') text:string) {
        return this.chatService.updateMessage(messageId, text);
    }
}