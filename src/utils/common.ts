import * as _ from 'lodash';

export function truncate(str: string, length: number) {
  if (!_.isNil(str)) {
    str = str.replace(/\r\n/g, '');
    if (str.length > length) {
      return `${str.substr(0, length)}...`;
    }
  }

  return str;
}
