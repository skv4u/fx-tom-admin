import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { WebService } from './web.service';

@Injectable()
export class ProdcastService {
  editlist: any = {}
  CategoryList: any = [];
  LanguageList:any = [];
  IsView:boolean=false;
  loginUserName: string = "";
  loader:boolean=false;
  selectedData:any={};
  UserStastics: any = {
    "PendingTotal":"",
    "ApprovedTotal": "",
    "RejectedTotal": "",
    "BlockedTotal": "",
    "TotalRJ": "",
    "CommentTotal":"",
    "LiveTotal":""
  }
  showPopUp:any={
    'approval':false,
    "rejected":false,
    "broadcast":false,
    "modify":false,
    "delete":false
  }
  dashboardList:any=[];
  dashboardList1:any=[];
  constructor(public webservice: WebService, public localStorage: LocalstorageService) {
    if(this.localStorage.getUserData()){
      this.loginUserName = this.localStorage.getUserData().fullname;
    }
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
  getDashBoardList() {
    this.webservice.commonMethod('podcast/all', '', 'GET').subscribe(
      (data) => {
        this.dashboardList = [];
        if (data.Response && data.Response.length) {
          this.dashboardList = data.Response;
          this.dashboardList1= data.Response;
          this.getUserStatistics();
        }
      }
    )
  }
  getUserStatistics() {
    let req = {
      "user_id": this.localStorage.getUserData().id
    }
    this.webservice.commonMethod('user/statistics/admin', req, 'GET').subscribe(
      (data)=>{
        if(data.Response && data.Response.length)
        this.UserStastics =data.Response[0];
      
      }
    )
  }
}
