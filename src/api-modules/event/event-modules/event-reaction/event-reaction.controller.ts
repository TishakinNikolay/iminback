import {Controller, Delete, Param, Post, Request, UseGuards} from '@nestjs/common';
import {LocalGuard} from '../../../user/user-modules/auth/guards/local.guard';
import {EventReactionService} from './event-reaction.service';
import {EventReactionCreateDto} from './models/dto/request/event-reaction.create.dto';
import {EventReactionResponseDto} from './models/dto/response/event-reaction.response.dto';

@Controller('/event-reaction')
export class EventReactionController {
    constructor(private readonly eventReactionService: EventReactionService) {
    }


    @Post('/favorite/:eventId')
    @UseGuards(LocalGuard)
    public async addToFavorite(@Request() req, @Param('eventId') eventId: number): Promise<EventReactionResponseDto> {
        const createReactionDto: EventReactionCreateDto = new EventReactionCreateDto();
        createReactionDto.user = req.user;
        createReactionDto.eventId = eventId;
        return this.eventReactionService.addFavoriteReaction(createReactionDto);
    }

    @Delete('/favorite/:eventId')
    @UseGuards(LocalGuard)
    public async removeFromFavorite(@Request() req, @Param('eventId') eventId: number): Promise<void> {
        const createReactionDto: EventReactionCreateDto = new EventReactionCreateDto();
        createReactionDto.user = req.user;
        createReactionDto.eventId = eventId;
        await this.eventReactionService.removeFromFavorite(createReactionDto);
    }
}