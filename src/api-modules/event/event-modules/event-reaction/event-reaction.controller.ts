import { Body, Controller, Post } from "@nestjs/common";
import { EventReactionService } from "./event-reaction.service";
import { EventReactionCreateDto } from "./models/dto/request/event-reaction.create.dto";
import { EventReactionResponseDto } from "./models/dto/response/event-reaction.response.dto";

@Controller('/event-reaction')
export class EventReactionController {
    constructor(private readonly eventReactionService: EventReactionService) { }
    @Post('/favorite')
    public async addToFavorite(@Body() createReactionDto: EventReactionCreateDto): Promise<EventReactionResponseDto> {
        return this.eventReactionService.addFavoriteReaction(createReactionDto);
    }
}