import { Injectable } from "@nestjs/common";
import { scalable, scalableBulk } from "../_shared/base/remap-decorator";
import { EventLocationService } from "./event-modules/event-location/event-location.service";
import { EventRepository } from "./event.repository";
import { FeedEventDto } from "./models/dto/feed/feed-event.dto";
import { CreateEventDto } from "./models/dto/create/create-event.dto";
import { ResponseEventDto } from "./models/dto/response/response-event.dto";
import { Event } from "./models/event.entity";
import { FeedRequest } from "./models/dto/feed/feed-request.dto";
import { UserService } from "../user/user.service";
import { ResponseUserDto } from "../user/models/response-user.dto";

@Injectable()
export class EventService {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly eventLocationService: EventLocationService,
        private readonly userService: UserService
    ) {
    }

    @scalable(ResponseEventDto)
    public async createEvent(createEventDto: CreateEventDto): Promise<Event> {
        Object.assign(createEventDto.eventLocation, await this.eventLocationService.createEventLocation(createEventDto.eventLocation));
        const event: Event = Object.assign(new Event(), createEventDto);
        return this.eventRepository.createEvent(event);
    }

    public getAllEvents(): Promise<Event[]> {
        return this.eventRepository.getAllEvents();
    }

    @scalableBulk(FeedEventDto)
    public async getFeedEvents(feedRequest: FeedRequest): Promise<Event[]> {
        const user: ResponseUserDto = await this.userService.getUserById(feedRequest.currentUser.id);
        const categoriesId = feedRequest.categories.map(category => category.id);
        return this.eventRepository.getFeedEvents(user.id, user.city.id, categoriesId);
    }
}