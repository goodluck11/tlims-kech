export class PageRequest {

  page: number;
  size: number;

  constructor(page: number, size: number) {
    this.page = page;
    this.size = size;
  }
}
