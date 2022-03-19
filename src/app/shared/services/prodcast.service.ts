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
    "LiveTotal":"",
    "TotalNotificationCount":"",
    "UnreadNotificationCount":"0"
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
  NotificationList:any=[];
  SelectedRJforApprove:string="";
  RJStatistics:any;
  filterApplied:boolean=false;

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
    this.loader=true;
    this.webservice.commonMethod('podcast/all', '', 'GET').subscribe(
      (data) => {
        this.loader=false;
        this.filterApplied=false;
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
        this.getRjStatistics();
        this.getNotificationList()
      }
    )
  }

  getRjStatistics() {
    let req = {
      "user_id": this.localStorage.getUserData().id
    }
    this.webservice.commonMethod('user/rjstatistics', req, 'GET').subscribe(
      (data)=>{
        if(data.Response && data.Response.length)
        this.RJStatistics =data.Response[0];
      }
    )
  }

  getNotificationList(){
    let req = {
      "user_id": this.localStorage.getUserData().id,
      "usertype":"Admin"
    }
    this.webservice.commonMethod('user/notificationlist', req, 'POST').subscribe(
      (data)=>{
        if(data.Response && data.Response.length)
        this.NotificationList = data.Response;
      },
      err=>{
        
      }
    )
  }
}
