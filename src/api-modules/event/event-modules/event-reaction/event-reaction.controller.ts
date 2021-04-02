import {Body, Controller, Post, Put, Request, UseGuards} from '@nestjs/common';
import {LocalGuard} from '../../../user/user-modules/auth/guards/local.guard';
import { EventReactionService } from "./event-reaction.service";
import { EventReactionCreateDto } from "./models/dto/request/event-reaction.create.dto";
import { EventReactionResponseDto } from "./models/dto/response/event-reaction.response.dto";

@Controller('/event-reaction')
export class EventReactionController {
    constructor(private readonly eventReactionService: EventReactionService) { }
    @Put('/favorite')
    @UseGuards(LocalGuard)
    public async addToFavorite(@Request() req, @Body() createReactionDto: EventReactionCreateDto): Promise<EventReactionResponseDto> {
        createReactionDto.user = req.user;
        return this.eventReactionService.addFavoriteReaction(createReactionDto);
    }
}