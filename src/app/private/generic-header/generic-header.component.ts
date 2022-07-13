import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';

@Component({
  selector: 'app-generic-header',
  templateUrl: './generic-header.component.html',
  styleUrls: ['./generic-header.component.scss']
})
export class GenericHeaderComponent implements OnInit {

  constructor(public prodcastService:ProdcastService,public router:Router,public localStorage:LocalstorageService,public renderer: Renderer2) { }
  srcimg="./assets/images/login-img.jpg";
  showhidecnd: any = {
    "showEdit": false,
    "ShowFilter": false,
    "showBell": false,
    "showEmail": false,
    "showSettings": false,
    "showEditProd": false
  }
  ngOnInit() {
    if(this.localStorage.getUserData() && this.localStorage.getUserData().profile_image !=""){
      this.srcimg=this.localStorage.getUserData().profile_image;
    }
  }
  logout(){
    localStorage.removeItem('admin_user_data');
    this.router.navigateByUrl('/login');
    
  }
  private cancelClick: Function;
  handleClick($event: any) {
    // console.log("unbind")
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
  resetvalues() {
    this.showhidecnd = {
      "showEdit": false,
      "ShowFilter": false,
      "showBell": false,
      "showEmail": false,
      "showSettings": false,
      "showEditProd": false
    }
    // this.showStatusDropDown = false;
    // this.showcatDropDown = false;
    // for (let a of this.prodcastService.dashboardList) {
    //   a.ShowstatusDropDown = false;
    // }
  }
}
