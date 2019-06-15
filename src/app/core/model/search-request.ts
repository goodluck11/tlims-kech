import {Paging} from './paging';

export class SearchRequest {

  constructor(public searchItem: string, public paging: Paging) {}
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
