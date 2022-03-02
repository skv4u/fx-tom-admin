import { Injectable } from '@angular/core';

@Injectable()
export class LocalstorageService {

  constructor() { }

  setUserData(param) {
    let str = JSON.stringify(param)
    localStorage.setItem('user_data', btoa(str));
  }

  getUserData() {
    let data = localStorage.getItem('user_data');
    data = atob(data);
    return JSON.parse(data);
  }
}
