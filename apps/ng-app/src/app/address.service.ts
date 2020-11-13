import { Injectable } from '@angular/core';
import * as JQL from 'jqljs';
import { Observable, of } from 'rxjs';
import data from './data.json';

export enum FieldsEnum {
  DISTRICT = 'd',
  AMPHOE = 'a',
  PROVINCE = 'p',
  ZIPCODE = 'z',
}
export interface IAddress {
  d: string;
  a: string;
  p: string;
  z: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  resolveResultbyField = (searchStr: IAddress): Observable<IAddress[]> => {
    const DB = new JQL(this.preprocess(data));
    let possibles: IAddress[] = [];
    Object.keys(searchStr).forEach((type) => {
      try {
        if (searchStr[type] != '' && type != 'p') {
          const possiblesLocal = DB.select('*')
            .where(type)
            .match(`^${searchStr[type]}`)
            .orderBy(type)
            .fetch();
          possibles = possibles.concat(possiblesLocal);
        }
      } catch (e) {
        console.log(e);
      }
    });

    possibles = possibles.filter((item, index) => {
      return possibles.indexOf(item) == index;
    });
    return of(possibles);
  };

  preprocess = (data): IAddress[] => {
    if (!data[0].length) {
      return data;
    }
    const expanded: IAddress[] = [];
    data.forEach((provinceEntry) => {
      const province = provinceEntry[0];
      const amphurList = provinceEntry[1];
      amphurList.forEach((amphurEntry) => {
        const amphur = amphurEntry[0];
        const districtList = amphurEntry[1];
        districtList.forEach((districtEntry) => {
          const district = districtEntry[0];
          const zipCodeList = districtEntry[1];
          zipCodeList.forEach((zipCode) => {
            expanded.push({
              d: district,
              a: amphur,
              p: province,
              z: zipCode,
            } as IAddress);
          });
        });
      });
    });
    return expanded;
  };
}
