import { EntityRepository, Repository } from "typeorm";
import { Event } from "./models/event.entity";

@EntityRepository(Event)
export class EventRepository extends Repository<Event>{
    createEvent(event: Event): Promise<Event> {
        return this.save(event);
    }
    getAllEvents() : Promise<Event[]> {
        return this.find();
    }
}