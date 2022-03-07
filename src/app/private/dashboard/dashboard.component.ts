import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showhidecnd: any = {
    "showEdit": false,
    "ShowFilter": false,
    "showBell": false,
    "showEmail": false,
    "showSettings": false,
    "showEditProd": false
  }
  showhidemenu:any={
    "RJName":true,
    "Thumbnails":true,
    "Title":true,
    "Category":true,
    "UploadDate":true,
    "Comments":true,
    "Approvals":true,
    "BroadcastDate":true,
    "Edit":true,
    "Delete":true
  }
  dashboardList: any = [];
  dashboardList1: any = this.dashboardList;
  serachvalue: string = "";
  showStatusDropDown:boolean=false;
  showcatDropDown:boolean=false;
  currentIndex:number=0;
  constructor(public router: Router, public webservice: WebService,public prodcastService:ProdcastService,public localStorage:LocalstorageService) { }

  ngOnInit() {
    console.log("this.localStorage.getUserData()",this.localStorage.getUserData())
    if(!this.localStorage.getUserData()){
      this.router.navigateByUrl('/login');
      return;
    }
    this.prodcastService.IsView = false;
    this.getDashBoardList();

  }
  searchList(data?:any) {
    let tempdata=data ? data : this.serachvalue
    let temp = this.dashboardList1.filter(x => JSON.stringify(x).toLowerCase().includes(tempdata.toLowerCase()));
    this.dashboardList = temp;
  }

  getDashBoardList() {
    // this.prodcastService.loader=true;
    this.webservice.commonMethod('podcast/all', '', 'GET').subscribe(
      (data) => {
        // this.prodcastService.loader=false;
        this.dashboardList = [];
        if (data.Response && data.Response.length) {
          this.dashboardList = data.Response;
          for (let a of data.Response) {          
              a.StatusCode = a.approvals.toLowerCase(),
              a.BroadCastDataTime= "20:30",
              a.UploadTime= "20:30",
              a.Comments= "None",
              a.Edit= true,
              a.Delete= false,
              a.EditProd= true,
              a.ShowProcastComment= false,
              a.ShowstatusDropDown= false
            
          }
        }
        this.dashboardList1 = this.dashboardList;
      }
    )
  }
  logOut(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  changeStatus(id,i){
    const el=document.getElementById(id);
    el.style.display = "block";
    el.style.opacity = "1";
    this.currentIndex=i;
  }
  closePopUp(id,action,approvals?,StatusCode?){
    const el=document.getElementById(id);
    el.style.display = "none";
    el.style.opacity = "0";
    if(action){
      this.dashboardList[this.currentIndex].approvals = approvals;
      this.dashboardList[this.currentIndex].StatusCode = StatusCode;
    }
  }
  closepopup(){
    this.showhidemenu={
      "RJName":true,
      "Thumbnails":true,
      "Title":true,
      "Category":true,
      "UploadDate":true,
      "Comments":true,
      "Approvals":true,
      "BroadcastDate":true,
      "Edit":true,
      "Delete":true
    }
  }
}

