import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { WebService } from './web.service';

@Injectable()
export class ProdcastService {
  editlist: any = {}
  CategoryList: any = [];
  WebCategoryList: any = [];
  LanguageList:any = [];
  IsView:boolean=false;
  loginUserName: string = "";
  loader:boolean=true;
  loaderMessage:string="Loading...";
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
  RJStatistics:any={
    "PendingRJTotal":"",
    "RejectedRJTotal": "",
    "ApprovedRJTotal": "",
    "BlockedRJTotal": "",
  };
  filterApplied:boolean=false;
  showComments:boolean=false;
  spotlist:any=[];
  constructor(public webservice: WebService, public localStorage: LocalstorageService) {
    if(this.localStorage.getUserData()){
      this.loginUserName = this.localStorage.getUserData().fullname;
    }
    this.getCategoryList();
    this.getLanguageList();
    this.getWebCategoryList();
    this.getSpotList();
  }
  getCategoryList() {
    this.CategoryList = [];
    this.webservice.commonMethod('category', '', 'GET').subscribe(
      (data) => {
        this.CategoryList = data.Response;
      }, err =>{
        // console.log(err);
        if(err.status === 401){
          localStorage.removeItem('adminttptoken');
          alert("Token expired!, Reloading the page");
          window.location.reload();
        }
      })
  }
  getWebCategoryList() {
    this.WebCategoryList = [];
    this.webservice.commonMethod('category/web', '', 'GET').subscribe(
      (data) => {
        this.WebCategoryList = data.Response;
      })
  }
  
  getSpotList() {
    this.spotlist = [];
    this.webservice.commonMethod('user/addspot', '', 'GET').subscribe(
      (data) => {
        this.spotlist = data.Response;
      })
  } 

  getLanguageList() {
    this.LanguageList = [];
    this.webservice.commonMethod('language', '', 'GET').subscribe(
      (data) => {
        this.LanguageList = data.Response;
      })
  }
  getDashBoardList() {
    this.loader=true;
    this.dashboardList = [];
    this.webservice.commonMethod('podcast/all', '', 'GET').subscribe(
      (data) => {
        this.loader=false;
        this.filterApplied=false;
        this.dashboardList = [];
        if (data.Response && data.Response.length) {
          this.dashboardList1= data.Response;
          this.dashboardList = data.Response;
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
