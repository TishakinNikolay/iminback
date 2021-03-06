export class CreateEventDto {
  constructor(
    public title: string,
    public date: Date,
    public startTime: Date,
    public endTime: Date,
    public organizerId: number,
    public description: string,
    public image: string,
    public totalOfPersons: string
    ){}
}