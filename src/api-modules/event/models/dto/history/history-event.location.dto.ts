import { HistoryEventLocationCityDto } from "./history-event.location-city.dto";

export class HistoryEventLocationDto {
    public id: number = null;
    public city: HistoryEventLocationCityDto = new HistoryEventLocationCityDto();
    public name: string = null;
    public address: string = null;
    public long: number = null;
    public lat: number = null;
}