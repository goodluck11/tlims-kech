import {Paging} from './paging';

export class SearchRequest {
  constructor(public searchTerm: string, public paging: Paging) {}
}

export class SearchRequest2 {
  constructor(public searchTerm: string, public paging: Paging, public category?: string) {}
}

export class NTuple {
  category: string;
  subCategory: string;
  subCatType: string;
  itemCondition: string;
  price: string;
  brands: string;
  paging: Paging;
}
