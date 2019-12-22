import {CodeValue} from 'core/model/base-model';
import {Category, ListItem, Picklist} from 'core/model/category';
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
    return code ? list.filter(l => l.categoryCode.dataCode === code)[0].titleDescription.title : null;
  }

  static getCategoryFromSubCategory(list: Array<Category>, code) {
    const subCategory = list.filter(l => l.categoryCode.dataCode === code)[0];
    return CodeValue.of(subCategory.parentCategory.categoryCode, subCategory.parentCategory.titleDescription.title);
  }

  static getNameFromPicklist(list: Array<Picklist>, code) {
    return code ? list.filter(l => l.pickListcode.dataCode === code)[0].titleDescription.title : null;
  }

  static getNameFromListItem(list: Array<ListItem>, code) {
    return code ? list.filter(l => l.listCode.dataCode === code)[0].titleDescription.title : null;
  }

  static getIdFromPicklist(list: Array<Picklist>, code) {
    return list.filter(l => l.pickListcode.dataCode === code)[0].id;
  }

  static convertPickListToCodeValue(data: Array<Picklist>) {
    return data.map(p => CodeValue.of(p.pickListcode.dataCode, p.titleDescription.title));
  }

  static convertCategoryoCodeValue(data: Array<Category>) {
    return data.map(p => CodeValue.of(p.categoryCode.dataCode, p.titleDescription.title));
  }

  static convertListItemToCodeValue(data: Array<ListItem>) {
    return data.map(p => CodeValue.of(p.listCode.dataCode, p.titleDescription.title));
  }

}

export function isArray(val: any) {
  return Array.isArray(val) && val.length > 0;
}

export function isEmpty(val: string) {
  return val === undefined || val === null || !val;
}

export function isObjectEmpty(obj) {
  return !obj || (Object.keys(obj).length === 0);
}
