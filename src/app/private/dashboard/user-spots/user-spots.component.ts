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
  NewSpotImage: any;
  NewSpotName: string;
  apiCalled: boolean = false;
  showPodCast: boolean = true;
  podCastList: any = [];
  showConfirmPopup: boolean = false;
  selectedpodcast: any;
  Id: any;
  constructor(public router: Router, public toast: ToastService, public prodCastService: ProdcastService, public localStorage: LocalstorageService, public webservice
    : WebService) { }


  ngOnInit() {
    this.podCastList = this.prodCastService.dashboardList;
    if (this.podCastList.length)
      this.selectedpodcast = this.podCastList[0].id;
  }
  CreateSpot() {
    if (this.NewSpotName == '') {
      this.toast.error('Please add Spot name');
      return;
    }
    if (this.NewSpotImage == '') {
      this.toast.error('Please select image');
      return;
    }
    this.prodCastService.loader = true;
    let req = {
      "title": this.NewSpotName,
      "link_type": "web",
      "link_value": this.selectedpodcast,
      "image": this.NewSpotImage,
      "sequence": "3"
    }
    this.webservice.commonMethod('/user/addspot', req, 'POST').subscribe(
      (data) => {
        this.toast.success("Add Spot created successfully")
        this.NewSpotName = "";
        this.NewSpotImage = "";
        this.prodCastService.loader = false;
        this.prodCastService.getSpotList();
      },
      err => {
        this.prodCastService.loader = false;
        this.toast.error("Oops, Something went wrong");
      }
    )
  }
  deleteSpot(id) {
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
          this.NewSpotImage = data.body.Response;
          this.prodCastService.loader = false;
          this.prodCastService.loaderMessage = "Uploading...";
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.prodCastService.loaderMessage = " Uploading :  " + percentDone + "%";
        }
      }, err => {
        this.prodCastService.loader = false;
        this.NewSpotImage = "";
        this.prodCastService.loaderMessage = "Uploading...";
      });
  }
  getLivepodcastList() {
    this.prodCastService.loader = true;
    this.webservice.commonMethod('podcast/list/live', '', 'GET').subscribe(
      (data) => {
        this.prodCastService.loader = false;
        this.podCastList = data.Response;
        if (this.podCastList.length)
          this.selectedpodcast = this.podCastList[0].podcast_id;
      })
  }
}
