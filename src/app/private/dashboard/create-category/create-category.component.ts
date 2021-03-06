import { HttpEventType } from '@angular/common/http';
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
  NewCatName: string = '';
  NewCatImage: string = '';
  NewCatSequence: number = 1;
  apiCalled: boolean = false;
  CategoryList: any = [];
  imageUrl: any = "";
  showConfirmPopup: any = "";
  Id: any = 0;
  caption = {
    "title":"Add Category",
    "button":"Add New Category"
  }
  constructor(public router: Router, public webservice: WebService, public prodCastService: ProdcastService, public localStorage: LocalstorageService, public toast: ToastService) { }

  ngOnInit() {
    
  }
  createCategory() {

    if (this.NewCatName == '') {
      this.toast.error('Please add category name');
      return;
    }
    if (this.NewCatImage == '') {
      this.toast.error('Please select image');
      return;
    }
    if (this.Id)
      this.CreateNewCategoryAPI();
    else
      this.CreateNewCategoryAPI();
  }
  CreateNewCategoryAPI() {
    this.prodCastService.loader = true;
    let req = {
      "name": this.NewCatName,
      "category_id": this.Id,
     // "created_by": this.localStorage.getUserData() ? this.localStorage.getUserData().username : '',
      "image": this.NewCatImage,
      "sequence": this.NewCatSequence
    }
    this.webservice.commonMethod('/category', req, 'POST').subscribe(
      (data) => {
        if(data.Status == 'Success'){
        if(this.Id){
          this.toast.success("Category updated successfully");
        }else{
          this.toast.success("Category created successfully");
        }
      }else{
        this.toast.error(data.Response);
      }
        // this.NewCatName = "";
        // this.NewCatImage = "";
        this.ResetCategory();
        this.prodCastService.loader = false;
        this.prodCastService.getWebCategoryList();
      }, err => {
          this.prodCastService.loader = false;this.prodCastService.TokenExpied(err.status);
      }
    )
  }
  deleteProdCast(id) {
    this.prodCastService.loader = true;
    this.webservice.commonMethod('/category/' + id, '', 'DELETE').subscribe(
      (data) => {
        if (data.Status == "Success") {
          this.toast.success("Deleted successfully");
          this.ResetCategory();
          this.prodCastService.loader = false;
          this.showConfirmPopup = false;
          this.prodCastService.getWebCategoryList();
        } else {
          this.prodCastService.loader = false;
          this.showConfirmPopup = false;
          this.toast.error(data.Response);
        }

      // },
      // err => {
      //   this.prodCastService.loader = false;
      //   this.toast.error("Oops, Something went wrong");
      }, err => {
          this.prodCastService.loader = false;
        this.showConfirmPopup = false;this.prodCastService.TokenExpied(err.status);
      }
    )
  }

  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    if (this.webservice.validImageList().indexOf(file.type) == -1) {
      this.toast.error("Invalid image");
      return
    }
    this.prodCastService.loader = true;
    // console.log(file, "element");
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.webservice.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        if (data.type === HttpEventType.Response) {
          this.NewCatImage = data.body.Response;
          this.prodCastService.loader = false;
          this.prodCastService.loaderMessage = "Uploading...";
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.prodCastService.loaderMessage = " Uploading :  " + percentDone + "%";
        }
      }, err => {
        this.prodCastService.loader = false;
        this.NewCatImage = "";
        this.prodCastService.loaderMessage = "Uploading...";
      });
  }
  editCategory(elem) {
    this.Id = elem.id;
    this.NewCatName = elem.name;
    this.NewCatImage = elem.image;
    this.NewCatSequence = elem.sequence;
    this.caption = {
      "title":"Edit Category",
      "button":"Update Category"
    }
    window.scrollTo(0, 0)
  }
  ResetCategory(){
    this.NewCatName = '';
    this.NewCatImage ='';
    this.NewCatSequence = 1;
    this.caption = {
      "title":"Add Category",
      "button":"Add New Category"
    }
    this.Id = 0;
  }
  removeFile(){
    let req = {
      filename : this.NewCatImage
  }
  this.prodCastService.loader = true;
  this.webservice.commonMethod("s3bucket/remove", req, 'DELETE').
    subscribe((data: any) => {
      this.prodCastService.loader = false;
      this.NewCatImage = '';
    },err => {
      this.prodCastService.loader = false;
      this.NewCatImage = '';
    });

  }
}
