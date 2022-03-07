import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { WebService } from './web.service';

@Injectable()
export class ProdcastService {
  editlist: any = {}
  CategoryList: any = [];
  LanguageList:any = [];
  IsView:boolean=false;
  loginUserName: string = this.localStorage.getUserData().fullname;
  loader:boolean=false;
  UserStastics: any = {
    "PendingTotal":"",
    "ApprovedTotal": "",
    "RejectedTotal": "",
    "BlockedTotal": "",
    "TotalRJ": "",
    "CommentTotal":"",
    "LiveTotal":""
  }
  constructor(public webservice: WebService, public localStorage: LocalstorageService) {
    this.getCategoryList();
    this.getLanguageList();
  }
  getCategoryList() {
    this.webservice.commonMethod('category', '', 'GET').subscribe(
      (data) => {
        this.CategoryList = data.Response;
      })
  }
  getLanguageList() {
    this.webservice.commonMethod('language', '', 'GET').subscribe(
      (data) => {
        this.LanguageList = data.Response;
      })
  }
}
