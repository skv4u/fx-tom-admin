import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageService {

  constructor() { }

  setUserData(param) {
    let str = JSON.stringify(param)
    localStorage.setItem('admin_user_data', btoa(str));
  }

  getUserData() {
    if (!localStorage.getItem('admin_user_data'))
      return null;
    let data = localStorage.getItem('admin_user_data');
    data = atob(data);
    return JSON.parse(data);
  }
}
