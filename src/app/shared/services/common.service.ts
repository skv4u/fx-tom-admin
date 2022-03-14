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


}
