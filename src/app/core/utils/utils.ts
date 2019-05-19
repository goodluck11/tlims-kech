import {CodeValue} from 'core/model/base-model';
import {Category, Picklist} from 'core/model/category';
import {isNullOrUndefined} from 'util';

export class Utils {

  static isEmpty(val: string): boolean {
    if (!isNullOrUndefined(val)) {
      if (val) {
        if (val.trim().length > 0) {
          return false;
        }
      }
    }
    return true;
  }

  static getNameFromCategory(list: Array<Category>, code) {
    return list.filter(l => l.categoryCode.dataCode === code)[0].titleDescription.title;
  }

  static getCategoryFromSubCategory(list: Array<Category>, code) {
    const subCategory = list.filter(l => l.categoryCode.dataCode === code)[0];
    return CodeValue.of(subCategory.parentCategory.categoryCode, subCategory.parentCategory.titleDescription.title);
  }

  static getNameFromPicklist(list: Array<Picklist>, code) {
    return list.filter(l => l.pickListcode.dataCode === code)[0].titleDescription.title;
  }

  static getIdFromPicklist(list: Array<Picklist>, code) {
    return list.filter(l => l.pickListcode.dataCode === code)[0].id;
  }

  static convertPickListToCodeValue(data: Array<Picklist>) {
    return data.map(p => CodeValue.of(p.pickListcode.dataCode, p.titleDescription.title));
  }

}
