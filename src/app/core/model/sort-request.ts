export class SortRequest {
  public column: string;
  public direction: string;
}


export enum Direction {
  DESC = 'desc',
  ASC = 'asc'
}
