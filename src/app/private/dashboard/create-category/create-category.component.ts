import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {
  NewCatName:string='';
  NewCatImage:string='';
  apiCalled:boolean = false;
  constructor(public router: Router,public webservice:WebService,public prodCastService:ProdcastService,public localStorage:LocalstorageService, public toast:ToastService) { }

  ngOnInit() {
  }
  createCategory(){
    this.prodCastService.loader=true;
    let req={
      "name": this.NewCatName,
      "image": this.NewCatImage,
      "created_by": this.localStorage.getUserData() ? this.localStorage.getUserData().username : ''
      }
      this.webservice.commonMethod('/category', req, 'POST').subscribe(
        (data) => {
          this.toast.success("Category created successfully")
          this.NewCatName = "";
          this.NewCatImage = "";
          this.prodCastService.loader=false;
          this.prodCastService.getCategoryList();
        },
        err =>{
          this.prodCastService.loader=false;
          this.toast.error("Oops, Something went wrong");
        }
        )
  }
  deleteProdCast(id){
    this.prodCastService.loader=true;
    this.webservice.commonMethod('/category/'+id, '', 'DELETE').subscribe(
      (data)=>{
        if(data.Status == "Success"){
          this.toast.success("Deleted successfully")
          this.prodCastService.loader=false;
          this.prodCastService.getCategoryList();
        }else{
          this.toast.error(data.Response);
        }
       
      },
      err =>{
        this.prodCastService.loader=false;
        this.toast.error("Oops, Something went wrong");
      }
    )
  }
}
