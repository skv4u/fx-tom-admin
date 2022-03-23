import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {
  NewCatName:string='';
  apiCalled:boolean = false;
  CategoryList:any=[];
  imageUrl:any="";
  constructor(public router: Router,public webservice:WebService,public prodCastService:ProdcastService,public localStorage:LocalstorageService) { }

  ngOnInit() {
  }
   
  categoryList(){
    this.prodCastService.loader=true;
    let req={
      "name": this.NewCatName,
      "created_by": this.localStorage.getUserData() ? this.localStorage.getUserData().username : ''
      }
      this.webservice.commonMethod('category/web', req, 'POST').subscribe(
        (data) => {
          this.prodCastService.loader=false;
          this.CategoryList = data.Response;
          this.prodCastService.getCategoryList();
        })
  }
  createCategory(){
    this.prodCastService.loader=true;
    let req={
      "name": this.NewCatName,
      "created_by": this.localStorage.getUserData() ? this.localStorage.getUserData().username : '',
      "image":
      }
      this.webservice.commonMethod('/category', req, 'POST').subscribe(
        (data) => {
          this.prodCastService.loader=false;
          this.prodCastService.getCategoryList();
        })
  }
  deleteProdCast(id){
    this.prodCastService.loader=true;
    this.webservice.commonMethod('/category/'+id, '', 'DELETE').subscribe(
      (data)=>{
        this.prodCastService.loader=false;
        this.prodCastService.getCategoryList();
      }
    )
  }
}
