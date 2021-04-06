import {EventImageDto} from '../event-image.dto';
import {EventLocationDto} from '../event-location.dto';
import {EventOwnerDto} from '../event-owner.dto';

export class UpdateEventDto {

    public id: number;
    public title: string;
    public startTime: Date;
    public endTime: Date;
    public owner: EventOwnerDto;
    public description: string;
    public image: EventImageDto;
    public eventLocation: EventLocationDto;
    public totalOfPersons: number;

    constructor() {
    }
}
