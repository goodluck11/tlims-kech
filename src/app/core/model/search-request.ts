import {Paging} from './paging';

export class SearchRequest {

  constructor(public searchItem: string, public paging: Paging) {}
}
