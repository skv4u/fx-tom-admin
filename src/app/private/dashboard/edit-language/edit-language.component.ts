import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-edit-language',
  templateUrl: './edit-language.component.html',
  styleUrls: ['./edit-language.component.scss']
})
export class EditLanguageComponent implements OnInit {

  NewLangName:string='';
  apiCalled:boolean = false;
  showConfirmPopup:boolean=false;
  Id:number=0;
  constructor(public router: Router,public webservice:WebService,public prodCastService:ProdcastService,public localStorage:LocalstorageService,public toast:ToastService) { }

  ngOnInit() {
  }
  createLanguage(){
    this.prodCastService.loader=true;
    let req={
      "name": this.NewLangName,
      "created_by": this.localStorage.getUserData() ? this.localStorage.getUserData().username : ''
      }
      this.webservice.commonMethod('/language', req, 'POST').subscribe(
        (data) => {
          this.prodCastService.loader=false;
          this.toast.success("Language created successfully")
          this.NewLangName = "";
          this.prodCastService.getLanguageList();
        }, err => {
          this.prodCastService.loader = false;
          if (err.status === 401) {
            this.prodCastService.TokenExpied();
          }
        }
        )
  }
  deleteLanguage(id){
    this.prodCastService.loader=true;
    this.webservice.commonMethod('/language/'+id, '', 'DELETE').subscribe(
      (data)=>{
        if(data.Status == "Success"){
          this.prodCastService.loader=false;
          this.showConfirmPopup=false;
          this.toast.success("Deleted successfully")
          this.prodCastService.getLanguageList();
        }else{
          this.prodCastService.loader=false;
          this.showConfirmPopup=false;
          this.toast.error(data.Response);
        }
      },
      err =>{
      }, err => {
        this.prodCastService.loader=false;
        this.showConfirmPopup=false;
        this.toast.error("Oops, Something went wrong");
        if (err.status === 401) {
          this.prodCastService.TokenExpied();
        }
      }
    )
  }

  
}

