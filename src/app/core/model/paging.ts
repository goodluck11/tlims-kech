export class Paging {

  public page: number;
  public limit: number;
  public order: string;

  constructor() {
    this.order = '-id';
    this.limit = 10;
    this.page = 1;
  }

  static of(page: number, limit: number, order?: string): Paging {
    const p = new Paging();
    if (order) {
      p.order = order;
    }
    p.limit = limit;
    p.page = page;
    return p;
  }
}
