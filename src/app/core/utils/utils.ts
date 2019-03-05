export class Utils {

  static isEmpty(val: string): boolean {
    if (val) {
      if (val.trim().length > 0) {
        return true;
      }
    }
    return false;
  }
}
