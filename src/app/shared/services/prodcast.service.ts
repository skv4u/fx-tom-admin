import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { ToastService } from './toast.service';
import { WebService } from './web.service';

@Injectable()
export class ProdcastService {
  editlist: any = {}
  CategoryList: any = [];
  WebCategoryList: any = [];
  LanguageList: any = [];
  IsView: boolean = false;
  loginUserName: string = "";
  loader: boolean = true;
  loaderMessage: string = "Loading...";
  selectedData: any = {};
  UserStastics: any = {
    "PendingTotal": "",
    "ApprovedTotal": "",
    "RejectedTotal": "",
    "BlockedTotal": "",
    "TotalRJ": "",
    "CommentTotal": "",
    "LiveTotal": "",
    "TotalNotificationCount": "",
    "UnreadNotificationCount": "0"
  }
  showPopUp: any = {
    'approval': false,
    "rejected": false,
    "broadcast": false,
    "modify": false,
    "delete": false,
    "Revoke": false
  }
  dashboardList: any = [];
  dashboardList1: any = [];
  NotificationList: any = [];
  SelectedRJforApprove: string = "";
  RJStatistics: any = {
    "PendingRJTotal": "",
    "RejectedRJTotal": "",
    "ApprovedRJTotal": "",
    "BlockedRJTotal": "",
  };
  filterApplied: boolean = false;
  showComments: boolean = false;
  spotlist: any = [];
  deleteList: any = [];
  deleteList1: any = [];

  pageNumber: number = 0;
  PAGE_SIZE: number = 10;
  totalRows: number = 0;
  gotopagelist: number[] = [];
  usecase:string = "";
  usecaseValue:any = "";
  constructor(public webservice: WebService, public localStorage: LocalstorageService,public toastService:ToastService) {
    if (this.localStorage.getUserData()) {
      this.loginUserName = this.localStorage.getUserData().fullname;
      // this.getCategoryList();

    }

  }
  getCategoryList() {
    this.CategoryList = [];
    this.webservice.commonMethod('category', '', 'GET').subscribe(
      (data) => {
        this.CategoryList = data.Response;
      }, err => {
        this.TokenExpied(err.status);
      })
  }
  getWebCategoryList() {
    this.WebCategoryList = [];
    this.webservice.commonMethod('category/web', '', 'GET').subscribe(
      (data) => {
        this.WebCategoryList = data.Response;
      }, err => {
        // if (err.status === 401) {
        this.TokenExpied(err.status);
        // }
      })
  }

  getSpotList() {
    this.spotlist = [];
    this.webservice.commonMethod('user/addspot', '', 'GET').subscribe(
      (data) => {
        this.spotlist = data.Response;
      }, err => {
        this.TokenExpied(err.status);
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
    this.loader = true;
    this.dashboardList = [];
    this.webservice.commonMethod('podcast/all', '', 'GET').subscribe(
      (data) => {
        this.loader = false;
        this.filterApplied = false;
        this.dashboardList = [];
        if (data.Response && data.Response.length) {
          this.dashboardList1 = data.Response;
          this.dashboardList = data.Response;
        }
        this.getUserStatistics();
      }, err => {
        this.TokenExpied(err.status);
      }
    );
  }
  getDashBoardListNew(dashflage?) {
    this.loader = true;
    this.dashboardList = [];
    this.webservice.commonMethod('podcast/all', 
    { 
      page_number: this.pageNumber, 
      page_size: this.PAGE_SIZE,
      usecase: this.usecase,
      value:this.usecaseValue
    }
      ).subscribe(
      (data) => {
        this.loader = false;
        if(!this.usecase.trim().length)
        this.filterApplied = false;
        this.dashboardList = [];
        if (data.Response && data.Response.list) {
          // this.dashboardList1 = data.Response;
          this.totalRows = data.Response.total_rows;
          this.dashboardList = data.Response.list;

          let t = Math.ceil(this.totalRows / this.PAGE_SIZE);
          let tl = [];
          for (let i = 0; i < t; i++) {
            tl.push(i);
          }
          this.gotopagelist = tl;
        }
        if (!dashflage)
          this.getUserStatistics();
      }, err => {
        this.TokenExpied(err.status);
      }
    );
  }
  getUserStatistics() {
    let req = {
      "user_id": this.localStorage.getUserData().id
    }
    this.webservice.commonMethod('user/statistics/admin', req, 'GET').subscribe(
      (data) => {
        if (data.Response && data.Response.length)
          this.UserStastics = data.Response[0];
        this.getRjStatistics();
        this.getNotificationList()
      }, err => {
        this.TokenExpied(err.status);
      }
    )
  }

  getRjStatistics() {
    let req = {
      "user_id": this.localStorage.getUserData().id
    }
    this.webservice.commonMethod('user/rjstatistics', req, 'GET').subscribe(
      (data) => {
        if (data.Response && data.Response.length)
          this.RJStatistics = data.Response[0];
      }, err => {
        this.TokenExpied(err.status);
      }
    )
  }

  getNotificationList() {
    let req = {
      "user_id": this.localStorage.getUserData().id,
      "usertype": "Admin"
    }
    this.webservice.commonMethod('user/notificationlist', req, 'POST').subscribe(
      (data) => {
        if (data.Response && data.Response.length)
          this.NotificationList = data.Response;
      }, err => {
        this.TokenExpied(err.status);
      }
    )
  }
  getDeletedList() {
    this.loader = true;
    this.webservice.commonMethod('podcast/deletedlist/admin', '', 'GET').subscribe(
      (data) => {
        this.loader = false;
        this.deleteList = data.Response;
        this.deleteList1 = data.Response;
      }, err => {
        this.TokenExpied(err.status);
      }
    )
  }

  TokenExpied(status) {
    if (status == 401) {
      localStorage.removeItem('adminttptoken');
      localStorage.removeItem('user_data');
      localStorage.removeItem('admin_user_data');
      alert("Session expired!, Rediecting to login");
      window.location.reload();
    }
    else{
      this.toastService.error("Please check internet connection!")
    }
    this.loader = false
  }

  paginate(type) {
    if (type == 'first') {
      this.pageNumber = 0;
    }
    else if (type == 'last') {
      if (this.pageNumber == this.getLastPage()) return;
      this.pageNumber = this.getLastPage();
    }
    else if (type == 'prev') {
      if (this.pageNumber == 0) return;
      this.pageNumber--;
    }
    else if (type == 'next') {
      if (this.pageNumber == this.getLastPage()) return;
      this.pageNumber++;
    }
    console.log(this.pageNumber,this.gotopagelist[this.gotopagelist.length - 1]);
    this.getDashBoardListNew(true);
  }
  getLastPage() {
    
    return this.gotopagelist[this.gotopagelist.length - 1];
    // return Math.floor(this.totalRows / this.PAGE_SIZE);
  }

  goToPage() {
    this.getDashBoardListNew(true);
  }
  pageSizeChange() {
    this.pageNumber = 0;
    this.getDashBoardListNew(true);
  }

}
