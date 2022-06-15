import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

  search: string = "";
  podcastList: any[] = [];
  // podcastName: string = '';
  // podcastDescription: string = '';
  // podcastImage: string = '';
  podcastDetails: any = {
    "podcast_id": "",
    "rj_user_id": "",
    "rj_name": "",
    "podcast_name": "",
    "description": "",
    "imagepath": ""
  }
  successCount: number = 0;
  failureCount: number = 0;
  constructor(public router: Router, public webservice: WebService, public toast: ToastService, public prodCastService: ProdcastService) { }

  ngOnInit() {
    this.getPodcastList();
  }
  loadSelectedPodcast(elem: any) {
    for (let a of this.podcastList) {
      a.Active = false;
    }
    elem.Active = true;
    this.podcastDetails = {
      "podcast_id": elem.podcast_id,
      "rj_user_id": elem.rj_user_id,
      "rj_name": elem.rj_name,
      "podcast_name": elem.podcast_name,
      "description": elem.description,
      "imagepath": elem.imagepath
    }
  }
  removeFile() {
    // let req = {
    //   filename: this.podcastDetails.imagepath
    // }
    // this.prodCastService.loader = true;
    // this.webservice.commonMethod("s3bucket/remove", req, 'DELETE').
    //   subscribe((data: any) => {
    //     this.prodCastService.loader = false;
    this.podcastDetails.imagepath = '';
    // }, err => {
    //   this.prodCastService.loader = false;
    //   this.podcastDetails.imagepath = '';
    // });

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
          this.podcastDetails.imagepath = data.body.Response;
          this.prodCastService.loader = false;
          this.prodCastService.loaderMessage = "Uploading...";
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.prodCastService.loaderMessage = " Uploading :  " + percentDone + "%";
        }
      }, err => {
        this.prodCastService.loader = false;
        this.podcastDetails.imagepath = "";
        this.prodCastService.loaderMessage = "Uploading...";
      });
  }
  apidone:boolean = false;
  sendtoAll(type: string) {
    this.apidone = false;
    if (!this.podcastDetails.podcast_name.trim().length) {
      this.toast.error('Please provide podcast name');
      return
    }
    if (!this.podcastDetails.description.trim().length) {
      this.toast.error('Please provide description');
      return
    }
    this.prodCastService.loader = true;
    this.prodCastService.loaderMessage = "Please wait...";
    let req = {
      "rj_id": this.podcastDetails.rj_user_id,
      "podcast_id": this.podcastDetails.podcast_id,
      "image": this.podcastDetails.imagepath,
      "title": this.podcastDetails.podcast_name,
      "description": this.podcastDetails.description,
      "type": type
    }
    this.webservice.commonMethod('fcm/send', req, 'POST').subscribe(
      (data) => {
        if (data.Status == 'Success') {
          let list = JSON.parse(data.Response);
          this.successCount = list.success;
          this.failureCount = list.failure;
        }
        this.prodCastService.loader = false;
        this.prodCastService.loaderMessage = "Please wait...";
        this.apidone = true;
      // },err =>{
      //   this.prodCastService.loader = false;
      }, err => {
        this.prodCastService.loader = false;
        this.prodCastService.loaderMessage = "Please wait...";
        // if (err.status === 401) {
          this.prodCastService.TokenExpied(err.status);
        // }
      })
  }
  getPodcastList() {
    this.webservice.commonMethod('user/fcmpodcast/list', '', 'GET').subscribe(
      (data) => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.podcastList = data.Response;
        }
        console.log(data, "data");
      }, err => {
          this.prodCastService.loader = false;this.prodCastService.TokenExpied(err.status);
      })
  }
}
