import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { 
    
  }
  customEmail(formControl: FormControl) {

    if (formControl.value) {
      let REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{1,50}$/i;
      return REGEXP.test(formControl.value) ? null : {
        customEmail: {
          valid: false
        }
      }
    }

  }

  customNumber(formControl: FormControl) {
    let REGEXP = /^\d+$/;
    return REGEXP.test(formControl.value) ? null : {
      customNumber: {
        valid: false
      }
    }
  }
  formatDate(date, format, seperator, isTime?: boolean) { //"Format:dd-mm-yy,mm-dd-yy,dd/mm/yy,dd:mm:yy" & Seperator - '-','/',',',':' ,time 24 hour format
    if (date != "" && date != undefined) {

      if (typeof date == 'string' && date.includes("GMT+")) {
        date = date.split("GMT+")[0];
      }
      else if (typeof date == 'string' && date.includes("+")) {
        date = date.split("+")[0];
      }
      let d = new Date(date),
        mm = '' + (d.getMonth() + 1),
        mmm: any = d.getMonth(),
        dd = '' + d.getDate(),
        yy = d.getFullYear();
      let month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (mm.length < 2) mm = '0' + mm;
      if (dd.length < 2) dd = '0' + dd;
      let part = format.split(seperator);
      mmm = month_names[mmm];

      let sHour = d.getHours();
      let sMinute = this.padValue(d.getMinutes());
      sHour = this.padValue(sHour);
      try {
        if (isTime) {
          return eval(part[0]) + seperator + eval(part[1]) + seperator + eval(part[2]) + " " + sHour + ":" + sMinute + " " ;
        }
        return eval(part[0]) + seperator + eval(part[1]) + seperator + eval(part[2]);
      }
      catch (e) {
        return '';
      }
    }
  }
  padValue(value): number {
    return (Number(value) < 10) ? "0" + value : value;
  }

}
