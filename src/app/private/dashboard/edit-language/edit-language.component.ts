import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-edit-language',
  templateUrl: './edit-language.component.html',
  styleUrls: ['./edit-language.component.scss']
})
export class EditLanguageComponent implements OnInit {

  NewLangName:string='';
  apiCalled:boolean = false;
  constructor(public router: Router,public webservice:WebService,public prodCastService:ProdcastService,public localStorage:LocalstorageService) { }

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
          this.prodCastService.getLanguageList();
        })
  }
  deleteLanguage(id){
    this.prodCastService.loader=true;
    this.webservice.commonMethod('/language/'+id, '', 'DELETE').subscribe(
      (data)=>{
        this.prodCastService.loader=false;
        this.prodCastService.getLanguageList();
      }
    )
  }
}

