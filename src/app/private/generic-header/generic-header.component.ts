import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';

@Component({
  selector: 'app-generic-header',
  templateUrl: './generic-header.component.html',
  styleUrls: ['./generic-header.component.scss']
})
export class GenericHeaderComponent implements OnInit {

  constructor(public prodcastService:ProdcastService,public router:Router,public localStorage:LocalstorageService) { }
  srcimg="./assets/images/login-img.jpg";
  ngOnInit() {
    if(this.localStorage.getUserData() && this.localStorage.getUserData().profile_image !=""){
      this.srcimg=this.localStorage.getUserData().profile_image;
    }
  }
  logout(){
    localStorage.removeItem('admin_user_data');
    this.router.navigateByUrl('/login');
    
  }
}
