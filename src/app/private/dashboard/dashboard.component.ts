import { Component, OnInit, Renderer2 } from '@angular/core';
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
  showhidemenu: any = {
    "RJName": true,
    "Thumbnails": true,
    "Title": true,
    "Category": true,
    "UploadDate": false,
    "Comments": true,
    "Approvals": true,
    "BroadcastDate": true,
    "Edit": true,
    "Delete": true,
    "Rank": true
  }
  serachvalue: string = "";
  showStatusDropDown: boolean = false;
  showcatDropDown: boolean = false;
  currentIndex: number = 0;
  apicalled: boolean = false;


  constructor(public router: Router, public webservice: WebService, public prodcastService: ProdcastService, public localStorage: LocalstorageService, public toast: ToastService, public renderer: Renderer2) { }

  ngOnInit() {
    // this.prodcastService.loader=false;
    // console.log("this.localStorage.getUserData()",this.localStorage.getUserData())
    if (!this.localStorage.getUserData()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.prodcastService.loginUserName = this.localStorage.getUserData().fullname;
    this.prodcastService.IsView = false;
    this.apicalled = true;
    this.prodcastService.getDashBoardList();
    this.apicalled = false;
    this.prodcastService.filterApplied = false;
  }
  searchList(data?: any) {
    let tempdata = data ? data : this.serachvalue
    // let temp = this.prodcastService.dashboardList1.filter(x => JSON.stringify(x).toLowerCase().includes(tempdata.toLowerCase()));
    let temp = this.prodcastService.dashboardList1.filter(x => Object.values(x).join("").toLowerCase().includes(tempdata.toLowerCase()));

    this.prodcastService.dashboardList = temp;
    this.prodcastService.filterApplied = true;

    this.resetvalues();
  }



  logOut() {
    localStorage.removeItem('admin_user_data');
    this.router.navigateByUrl('/login');
  }
  changeStatus(status, a, i) {

    if (['Live', 'Broadcasting', 'Rejected', 'Modify'].indexOf(a.approvals) != -1) {
      this.toast.error('Podcast is ' + a.approvals);
      return;
    }
    // if((a.approvals == 'Approved') && status == 'Pending'){
    //   this.toast.error('Podcast is' +' '+a.approvals)
    //   return
    // }
    this.currentIndex = i;
    this.prodcastService.selectedData = a;
    if (status == 'Approved')
      this.prodcastService.showPopUp.approval = true
    else if (status == 'Rejected')
      this.prodcastService.showPopUp.rejected = true
    else if (status == 'Broadcast') {
      if (a.approvals != 'Approved') {
        this.toast.error('selected podcast is not approved');
        return;
      }
      this.prodcastService.showPopUp.broadcast = true;
    }
    else if (status == 'Modify')
      this.prodcastService.showPopUp.modify = true
    else if (status == 'Delete') {
      if (a.approvals == 'Live') {
        this.toast.error('Podcast has been live');
        return;
      }
      this.prodcastService.showPopUp.delete = true;
    }
  }
  closePopUp(id, action, approvals?, StatusCode?) {
    if (action) {
      this.prodcastService.dashboardList[this.currentIndex].approvals = approvals;
      this.prodcastService.dashboardList[this.currentIndex].StatusCode = StatusCode;
    }
  }
  getSelectedList(a) {
    this.showhidecnd.showBell = false;
    this.prodcastService.filterApplied = true;
    if (a.notification_type.includes('PODCAST')) {
      // let tempdata = a.podcast_id;
      // let temp = this.prodcastService.dashboardList1.filter(x => JSON.stringify(x.id).toLowerCase().includes(tempdata.toLowerCase()));
      this.prodcastService.dashboardList = this.prodcastService.dashboardList1.filter(v => v.id == a.podcast_id);
      this.resetvalues();
      this.prodcastService.filterApplied = true;
      return;
    }
    if (a.notification_type == 'NEW_RJ' || a.notification_type == 'UPDATE_RJ') {
      // this.prodcastService.SelectedRJforApprove = a.user_id;
      this.router.navigateByUrl('/rj-approvals');
    }
  }
  updateNotification() {
    this.webservice.commonMethod('user/notification/adminupdate', '', 'PUT').subscribe(
      (data) => {
        this.prodcastService.getUserStatistics();
      }
    )
  }
  enableEdit(a) {
    if (['Live', 'Broadcasting', 'Rejected', 'Modify'].indexOf(a.approvals) != -1) {
      this.toast.error('Podcast is ' + a.approvals);
      return;
    }
    else {
      this.showhidecnd.showEdit = true;
      this.prodcastService.editlist = a;
      this.prodcastService.IsView = false;
    }
  }
  resetvalues() {
    this.showhidecnd = {
      "showEdit": false,
      "ShowFilter": false,
      "showBell": false,
      "showEmail": false,
      "showSettings": false,
      "showEditProd": false
    }
    this.showStatusDropDown = false;
    this.showcatDropDown = false;
    for (let a of this.prodcastService.dashboardList) {
      a.ShowstatusDropDown = false;
    }
  }


  showhideBellList() {
    this.showhidecnd.showBell = !this.showhidecnd.showBell;
    if (this.showhidecnd.showBell) {
      this.bindSingleClickEvent();
    }
    this.updateNotification();
  }
  expandCategoryFilter() {
    this.showcatDropDown = !this.showcatDropDown;
    if (this.showcatDropDown)
      this.bindSingleClickEvent();
  }
  expandStatusFilter() {
    this.showStatusDropDown = !this.showStatusDropDown;
    if (this.showStatusDropDown)
      this.bindSingleClickEvent();
  }
  private cancelClick: Function;
  handleClick($event: any) {
    console.log("unbind")
    let target = $event.target.classList.contains('outsideclick') ||
      $event.target.parentNode.classList.contains('outsideclick')
    if (target || target == null) return;
    this.resetvalues();
    this.cancelClick();
  }
  bindSingleClickEvent() {
    if (this.cancelClick) this.cancelClick();
    this.cancelClick = this.renderer.listen('document', 'click',
      ($event: any) => this.handleClick($event));
  }
  showCommentSection(elem) {
    this.prodcastService.selectedData = elem;
    this.prodcastService.showComments = true;
  }
  setrank(id,rank) {
    if(rank <= 0){
      this.toast.error('Rank should be greater or equal to one');
      return;
    }
    this.prodcastService.loader = true;
    let req = {
      "podcast_id": id,
      "rank": rank
    }
    this.webservice.commonMethod('podcast/updaterank/admin', req, 'PUT').subscribe(
      (data) => {
        this.prodcastService.loader=false;
        if(data.Status == 'Success' && data.Response){
          this.toast.success('Rank Updated Sucesfully');
        }
      }
    )
  }
}

