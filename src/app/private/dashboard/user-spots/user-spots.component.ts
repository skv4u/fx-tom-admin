import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-user-spots',
  templateUrl: './user-spots.component.html',
  styleUrls: ['./user-spots.component.scss']
})
export class UserSpotsComponent implements OnInit {
  // NewSpotImage: any;
  // NewSpotName: string;
  apiCalled: boolean = false;
  showPodCast: boolean = true;
  podCastList: any = [];
  showConfirmPopup: boolean = false;
  Id: any = 0;
  caption = {
    "title": "Ads Spot",
    "button": "Create Ads"
  }
  // selectedpodcast: any;

  addSpot = {
    "addspot_id": 0,
    "title": "",
    "link_type": "web",
    "link_value": "",
    "image": "",
    "sequence": "1"
  }

  constructor(public router: Router, public toast: ToastService, public prodCastService: ProdcastService, public localStorage: LocalstorageService, public webservice
    : WebService) { }


  ngOnInit() {
    // this.podCastList = this.prodCastService.dashboardList;
    // if (this.podCastList.length)
    // addSpot = this.podCastList[0].id;
    this.getLivepodcastList();
  }
  CreateSpot() {
    if (!this.addSpot.title.trim().length) {
      this.toast.error('Please add ads name');
      return;
    }

    if (!this.addSpot.image.trim().length) {
      this.toast.error('Please select image');
      return;
    }
    this.prodCastService.loader = true;

    this.webservice.commonMethod('/user/addspot', this.addSpot, 'POST').subscribe(
      (data) => {
        if(data.Status == 'Success'){
          if(this.Id){
            this.toast.success("Ads Spot updated successfully");
          }else{
            this.toast.success("Ads Spot created successfully");
          }
        }else{
          this.toast.error(data.Response); 
        }
        // this.NewSpotName = "";
        // this.NewSpotImage = "";
        this.ResetCategory();
        this.addSpot = {
          "addspot_id": 0,
          "title": "",
          "link_type": "web",
          "link_value": "",
          "image": "",
          "sequence": "1"
        };
        this.prodCastService.loader = false;
        this.prodCastService.getSpotList();
      },
      err => {
        this.prodCastService.loader = false;
        this.toast.error("Oops, Something went wrong");
      }
    )
  }
  deleteSpot() {
    this.prodCastService.loader = true;
    let req = {
      "addspot_id": this.Id
    }
    this.webservice.commonMethod('user/addspot', req, 'DELETE').subscribe(
      (data) => {
        if (data.Status == "Success") {
          this.toast.success("Deleted successfully")
          this.prodCastService.loader = false;
          this.showConfirmPopup = false;
          this.prodCastService.getSpotList();
          this.ResetCategory()
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
          this.addSpot.image = data.body.Response;
          this.prodCastService.loader = false;
          this.prodCastService.loaderMessage = "Uploading...";
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.prodCastService.loaderMessage = " Uploading :  " + percentDone + "%";
        }
      }, err => {
        this.prodCastService.loader = false;
        this.addSpot.image = "";
        this.prodCastService.loaderMessage = "Uploading...";
      });
  }
  getLivepodcastList() {
    this.prodCastService.loader = true;
    this.webservice.commonMethod('podcast/list/live', '', 'GET').subscribe(
      (data) => {
        this.prodCastService.loader = false;
        this.podCastList = data.Response;
        // if (this.podCastList.length)
        //   this.addSpot.link_value = this.podCastList[0].podcast_id;
      })
  }
  LinkTypeChage() {
    if (this.addSpot.link_type == 'podcast') {
      this.addSpot.link_value = this.podCastList[0].podcast_id
    }
  }
  editCategory(elem: any) {
    this.addSpot = {
      "addspot_id": elem.addspot_id,
      "title": elem.title,
      "link_type": elem.link_type,
      "link_value": elem.link_value,
      "image": elem.image,
      "sequence": elem.sequence
    }
    this.Id = elem.addspot_id;
    this.caption = {
      "title": "Edit Ads Spot",
      "button": "Update Ads"
    }
  }
  ResetCategory() {
    this.caption = {
      "title": "Ads Spot",
      "button": "Create Ads"
    }
    this.addSpot = {
      "addspot_id": 0,
      "title": "",
      "link_type": "web",
      "link_value": "",
      "image": "",
      "sequence": "1"
    }
    this.Id = 0;
  }
  removeFile(){
    let req = {
      filename : this.addSpot.image
  }
  this.prodCastService.loader = true;
  this.webservice.commonMethod("s3bucket/remove", req, 'DELETE').
    subscribe((data: any) => {
      this.prodCastService.loader = false;
      this.addSpot.image = '';
    },err => {
      this.prodCastService.loader = false;
      this.addSpot.image = '';
    });

  }
}
