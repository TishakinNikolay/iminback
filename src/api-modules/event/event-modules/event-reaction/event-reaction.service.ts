import {Injectable} from '@nestjs/common';
import {scalable} from '../../../_shared/decorators/remap.decorator';
import {EventReactionType} from './enums/event-reaction-type.enum';
import {EventReactionRepository} from './event-reaction.repository';
import {EventReactionCreateDto} from './models/dto/request/event-reaction.create.dto';
import {EventReactionResponseDto} from './models/dto/response/event-reaction.response.dto';
import {EventReaction} from './models/event-reaction.entity';

@Injectable()
export class EventReactionService {
    constructor(private readonly eventReactionRepository: EventReactionRepository) {
    }

    @scalable(EventReactionResponseDto)
    public async addFavoriteReaction(eventFavoriteReactionDto: EventReactionCreateDto): Promise<EventReaction> {
        eventFavoriteReactionDto.reactionType = EventReactionType.ADD_TO_FAVORITE;
        const existingReaction: EventReaction[] = await EventReaction.find(eventFavoriteReactionDto);
        if(existingReaction.length > 0) {
            return existingReaction[0];
        }
        const reaction: EventReaction = Object.assign(new EventReaction(), eventFavoriteReactionDto);
        return this.eventReactionRepository.addEventReaction(reaction);
    }

    public async removeFromFavorite(eventFavoriteReactionDto: EventReactionCreateDto) {
        await this.eventReactionRepository.removeEventReaction(eventFavoriteReactionDto.eventId, eventFavoriteReactionDto.user.id);
    }
}