import { UpcomingEventLocationCityDto } from "./upcoming-event.location-city.dto";

export class UpcomingEventLocationDto {
    public id: number = null;
    public city: UpcomingEventLocationCityDto = new UpcomingEventLocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
}