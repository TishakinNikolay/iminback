import { HistoryEventLocationCountryDto } from "./history-event.location-country.dto";

export class HistoryEventLocationCityDto {
    public id: number = null;
    public name: string = null;
    public country: HistoryEventLocationCountryDto = new HistoryEventLocationCountryDto();
    constructor() {

    }
}