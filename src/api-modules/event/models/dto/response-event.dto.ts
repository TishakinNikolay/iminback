export class ResponseEventDto {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
    public startTime: Date,
    public endTime: Date,
    public description: string,
    public totalOfPersons: string
  ) { }
}
