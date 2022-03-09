import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
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
  serachvalue: string = "";
  showStatusDropDown:boolean=false;
  showcatDropDown:boolean=false;
  currentIndex:number=0;

  constructor(public router: Router, public webservice: WebService,public prodcastService:ProdcastService,public localStorage:LocalstorageService,public toast:ToastService) { }

  ngOnInit() {
    console.log("this.localStorage.getUserData()",this.localStorage.getUserData())
    if(!this.localStorage.getUserData()){
      this.router.navigateByUrl('/login');
      return;
    }
    this.prodcastService.loginUserName = this.localStorage.getUserData().fullname;
    this.prodcastService.IsView = false;
    this.prodcastService.getDashBoardList();
    

  }
  searchList(data?:any) {
    let tempdata=data ? data : this.serachvalue
    let temp = this.prodcastService.dashboardList1.filter(x => JSON.stringify(x).toLowerCase().includes(tempdata.toLowerCase()));
    this.prodcastService.dashboardList = temp;
  }


  logOut(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  changeStatus(status,a,i){
    this.currentIndex=i;
    this.prodcastService.selectedData = a;
    if(status == 'Approved')
    this.prodcastService.showPopUp.approval = true
    else if(status == 'Rejected')
    this.prodcastService.showPopUp.rejected = true
    else if(status == 'Broadcast'){
      if(a.approvals != 'Approved'){
        this.toast.error('selected prodcast is not approved');
        return;
      }
    this.prodcastService.showPopUp.broadcast = true;
    }
    else if(status == 'Modify')
    this.prodcastService.showPopUp.modify = true
    else if(status == 'Delete')
    this.prodcastService.showPopUp.delete = true
  }
  closePopUp(id,action,approvals?,StatusCode?){
    if(action){
      this.prodcastService.dashboardList[this.currentIndex].approvals = approvals;
      this.prodcastService.dashboardList[this.currentIndex].StatusCode = StatusCode;
    }
  }
  getSelectedList(a){
    this.showhidecnd.showBell = false;
    if(a.notification_type == 'CREATE_PODCAST'){
    let tempdata = a.podcast_id;
    let temp = this.prodcastService.dashboardList1.filter(x => JSON.stringify(x.id).toLowerCase().includes(tempdata.toLowerCase()));
    this.prodcastService.dashboardList = temp;
    }
  }
  updateNotification(){
    this.webservice.commonMethod('user/notification/adminupdate', '', 'PUT').subscribe(
      (data)=>{
        this.prodcastService.getUserStatistics();
      }
    )
  }
}

