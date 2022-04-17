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
  apiCalled: boolean = false;
  CategoryList: any = [];
  imageUrl: any = "";
  showConfirmPopup: any = "";
  Id: any = "";
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
      "created_by": this.localStorage.getUserData() ? this.localStorage.getUserData().username : '',
      "image": this.NewCatImage
    }
    this.webservice.commonMethod('/category', req, 'POST').subscribe(
      (data) => {
        this.toast.success("Category created successfully")
        this.NewCatName = "";
        this.NewCatImage = "";
        this.prodCastService.loader = false;
        this.prodCastService.getWebCategoryList();
      },
      err => {
        this.prodCastService.loader = false;
        this.toast.error("Oops, Something went wrong");
      }
    )
  }
  deleteProdCast(id) {
    this.prodCastService.loader = true;
    this.webservice.commonMethod('/category/' + id, '', 'DELETE').subscribe(
      (data) => {
        if (data.Status == "Success") {
          this.toast.success("Deleted successfully")
          this.prodCastService.loader = false;
          this.showConfirmPopup = false;
          this.prodCastService.getWebCategoryList();
        } else {
          this.prodCastService.loader = false;
          this.showConfirmPopup = false;
          this.toast.error(data.Response);
        }

      },
      err => {
        this.prodCastService.loader = false;
        this.showConfirmPopup = false;
        this.toast.error("Oops, Something went wrong");
      }
    )
  }

  uploadFile(element) {
    this.prodCastService.loader = true;
    const file = element[0];
    if (file == undefined) return;
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
    this.caption = {
      "title":"Edit Category",
      "button":"Update Category"
    }
  }
}
