import {IsNotEmpty} from 'class-validator';

export class RequestMapPointDto {
    @IsNotEmpty()
    public long: number = null;
    @IsNotEmpty()
    public lat: number = null;
}