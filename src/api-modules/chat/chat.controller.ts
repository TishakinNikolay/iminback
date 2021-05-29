import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
import {LocalGuard} from '../user/user-modules/auth/guards/local.guard';
import {ChatService} from './chat.service';
import {User} from "../user/models/user.entity";

@Controller('/chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
    ) {
    }

    @Get('/')
    @UseGuards(LocalGuard)
    public async getUserChats(@Query() query,@Request() req) {
        const page = query.page;
        const pageSize = query.pageSize;
        const user =  req.user;
        return this.chatService.getUserChats(user, page,pageSize);
    }
    @Get('search/:name')
    @UseGuards(LocalGuard)
    public async search(@Param('name') name: string, @Query() query) {
        const page = query.page ? query.page : 0;
        const pageSize = query.pageSize ? query.pageSize : 10;

        return this.chatService.search(page,pageSize,name)
    }
    @Post('/message')
    @UseGuards(LocalGuard)
    public async postMessage(@Body('text') text: string, @Body('chatId') chatId: number, @Request() req) {
        const user: User = req.user;
        return this.chatService.postMessage(user.id, chatId, text);

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
    @Get('/load/:chatId')
    @UseGuards(LocalGuard)
    public async onChatOpen(@Param('chatId') chatId: number, @Request() req) {
        const user = req.user;
        return this.chatService.onChatOpen(user, chatId);
    }
    @Get('/message/:chatId')
    @UseGuards(LocalGuard)
    public async getChatMessages(@Param('chatId') chatId: number, @Request() req, @Query() query) {
        const user = req.user;
        const scrollVector = query.scrollVector;
        const pageSize = query.pageSize;
        const offsetId = query.offsetId;
        return this.chatService.getChatMessages(user,offsetId,pageSize,chatId,scrollVector);
    }

    @Put('/view/:chatId/:lastMessageId')
    @UseGuards(LocalGuard)
    public async setMessagesViewed(@Param('lastMessageId') lastMessageId, @Param('chatId') chatId, @Request() req) {
        const user = req.user;
        return this.chatService.setMessagesViewed(lastMessageId,chatId, user);
    }
}
