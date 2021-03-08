import { EntityRepository, Repository } from "typeorm";
import { EventLocation } from "./models/event-location.entity";

@EntityRepository(EventLocation)
export class EventLocationRepository extends Repository<EventLocation> {
   createEventLocation(eventLocation: EventLocation) : Promise<EventLocation> {
       return this.save(EventLocation);
   }
}