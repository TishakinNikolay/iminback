export class CreateEventDto {
  constructor(
    public title: string,
    public date: Date,
    public startTime: Date,
    public endTime: Date,
    public owner: EventOwnerDto,
    public description: string,
    public image: string,
    public totalOfPersons: string
  ) { }
}
