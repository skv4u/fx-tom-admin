import { HttpEventType } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { error } from '@angular/compiler/src/util';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-admin-edit-prodcast',
  templateUrl: './admin-edit-prodcast.component.html',
  styleUrls: ['./admin-edit-prodcast.component.scss']
})
export class AdminEditProdcastComponent implements OnInit {
  @Output() back = new EventEmitter();
  EditData: any = {};
  CategoryList: any = [];
  LanguageList: any = [];
  noteList: any = [];
  ShowList: any = [];
  constructor(public webservice: WebService, public prodcastservice: ProdcastService, public LocalStorage: LocalstorageService, public toast: ToastService, public router: Router) { }

  ngOnInit() {
    this.EditData = this.prodcastservice.editlist;
    if (!Array.isArray(this.EditData.category))
      this.EditData.category = this.EditData.category.split(",");
    this.EditData.age_restriction = this.EditData.age_restriction == 1 ? true : false;
    this.EditData.Notestocommunicate = "";
    this.getProdNoteList();
    this.getShowList();
  }
  getProdNoteList() {
    this.prodcastservice.loader = true;
    let req = {
      "podcast_id": this.EditData.id
    }
    this.webservice.commonMethod('podcast/note/list ', req, 'POST').subscribe(
      (data) => {
        this.prodcastservice.loader = false;
        this.noteList = data.Response;
      }, err => {
        if (err.status === 401) {
          this.prodcastservice.TokenExpied();
        }
      })
  }

  uploadaudio(element) {

    const file = element[0];
    if (file == undefined) return;
    // console.log(file.type, "element");
    //  if(!(file.type.indexOf('audio') != -1 || file.type.indexOf('video') != -1)){
    //    this.toast.error("Invalid audio file");
    //    return
    // }
    if (this.webservice.validAudioList().indexOf(file.type) == -1) {
      this.toast.error("Invalid audio file");
      return
    }
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.prodcastservice.loader = true;
    this.webservice.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        if (data.type === HttpEventType.Response) {
          console.log(data);
          this.EditData.audiopath = data.body.Response;
          this.prodcastservice.loader = false;
          this.prodcastservice.loaderMessage = "Uploading...";
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.prodcastservice.loaderMessage = " Uploading :  " + percentDone + "%";
        }
      }, err => {

        this.prodcastservice.loader = false;
        this.prodcastservice.loaderMessage = "Uploading...";
        this.EditData.audiopath = "";
      });


    // subscribe((data: any) => {
    //   this.EditData.audiopath = data.Response;
    //   this.prodcastservice.loader = false;
    // }, err => {

    // });

  }

  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    if (this.webservice.validImageList().indexOf(file.type) == -1) {
      this.toast.error("Invalid image");
      return
    }
    this.prodcastservice.loader = true;
    // console.log(file, "element");
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.webservice.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        if (data.type === HttpEventType.Response) {
          this.EditData.imagepath = data.body.Response;
          this.prodcastservice.loader = false;
          this.prodcastservice.loaderMessage = "Uploading...";
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.prodcastservice.loaderMessage = " Uploading :  " + percentDone + "%";
        }
      }, err => {
        this.prodcastservice.loader = false;
        this.EditData.imagepath = "";
        this.prodcastservice.loaderMessage = "Uploading...";
      });



    //   this.http.post(this.APIUrl.DEV + '/' + url, formData, {
    //     headers,
    //     reportProgress: true,
    //     observe: 'events'
    //   }).subscribe(resp => {
    //     if (resp.type === HttpEventType.Response) {
    //       console.log('Upload complete');
    //     }
    //     if (resp.type === HttpEventType.UploadProgress) {
    //       const percentDone = Math.round(100 * resp.loaded / resp.total);
    //       console.log('Progress ' + percentDone + '%');
    //     }
    //   });
    // }



  }
  // getnamebyid(id){
  //   for(let a of this.ShowList){
  //     if(a.shows_id == id){
  //       return a.show
  //     }
  //   }
  // }

  updateProdCast() {
    if (!this.EditData.Notestocommunicate.trim().length) {
      this.toast.error('Please add Notes');
      return;
    }
    if (this.EditData.audiopath == '') {
      this.toast.error('Please upload audio');
      return;
    }
    if (this.EditData.imagepath == '') {
      this.toast.error('Please upload image');
      return;
    }
    if (this.EditData.category == '') {
      this.toast.error('Please select category');
      return;
    }
    this.prodcastservice.loader = true;
    this.EditData.category = this.EditData.category.join(",");
    let req = {
      "id": this.EditData.id,
      "user_id": this.EditData.user_id,
      "name": this.EditData.name,
      "author_name": this.EditData.author_name,
      "language": this.EditData.language,
      "category": this.EditData.category,
      "description": this.EditData.description,
      "imagepath": this.EditData.imagepath,
      "audiopath": this.EditData.audiopath,
      "status": this.EditData.approvals,
      "age_restriction": this.EditData.age_restriction ? 1 : 0,
      "created_by": this.LocalStorage.getUserData().username,
      "usertype": "Admin",
      "note_description": this.EditData.Notestocommunicate,
      "shows_id": this.EditData.shows_id
      // "audio_path": this.EditData.audiopath

    }
    this.webservice.commonMethod('podcast/update', req, 'PUT').subscribe(
      (data) => {
        this.prodcastservice.loader = false;
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.toast.success('Updated Sucessfully');
          this.back.emit();
          // this.router.navigateByUrl('/dashboard');
          // this.EditData.category = this.EditData.category.join(",");

        }
      }, err => {
        if (err.status === 401) {
          this.prodcastservice.TokenExpied();
        }
      }
    )
  }
  backtodashboard() {
    this.prodcastservice.loader = false;
    // this.router.navigateByUrl('/dashboard');
    this.prodcastservice.IsView = false;
    this.EditData.category = this.EditData.category.join(",");
    this.back.emit()
  }
  removeAudio() {
    this.prodcastservice.loader = true;
    let req = {
      filename: this.EditData.audiopath
    }
    this.webservice.commonMethod("s3bucket/remove", this.EditData.audiopath, 'DELETE').
      subscribe((data: any) => {
        this.prodcastservice.loader = false;
        this.EditData.audiopath = '';
      }, err => {
        this.prodcastservice.loader = false;
        this.EditData.audiopath = '';//temp added due to api error
      });
  }
  removeFile() {
    this.prodcastservice.loader = true;
    let req = {
      filename: this.EditData.imagepath
    }
    this.webservice.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this.EditData.imagepath = '';
        this.prodcastservice.loader = false;
      }, err => {
        this.prodcastservice.loader = false;
        this.EditData.imagepath = '';
      });
  }
  enableagerestriction() {
    this.EditData.age_restriction = this.EditData.age_restriction == true ? false : true;
  }
  getShowList() {
    this.webservice.commonMethod('user/shows/' + this.EditData.user_id, '', 'GET').subscribe(
      (data) => {
        this.ShowList = data.Response;
      }, err => {
        if (err.status === 401) {
          this.prodcastservice.TokenExpied();
        }
      })
  }
  getAudioName(){
    if(this.EditData.audiopath){
      let str = this.EditData.audiopath.substring(this.EditData.audiopath.lastIndexOf("/")+1);
      return str.substring(str.indexOf("_")+1);
    }
    return '';
  }

}
