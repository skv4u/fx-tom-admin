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
  constructor(public webservice: WebService, public prodcastservice: ProdcastService,public LocalStorage:LocalstorageService,public toast:ToastService,public router:Router) { }

  ngOnInit() {
    this.EditData = this.prodcastservice.editlist;
    if(this.EditData.category.length)
    this.EditData.category = this.EditData.category.split(",");
    this.EditData.age_restriction = this.EditData.age_restriction == 1 ? true : false;
    this.getProdNoteList();
  }
  getProdNoteList() {
    this.prodcastservice.loader=true;
    let req = {
      "podcast_id": this.EditData.id
    }
    this.webservice.commonMethod('podcast/note/list ', req, 'POST').subscribe(
      (data) => {
        this.prodcastservice.loader=false;
        this.noteList = data.Response;
      })
  }
  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    console.log(file, "element");
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.webservice.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.EditData.imagepath = data.Response;
      }, err => {
      });
  }

  updateProdCast() {
    
    if(this.EditData.Notestocommunicate == ''){
      this.toast.error('Please add Notes');
      return;
    }
    this.prodcastservice.loader=true;
    let req = {
      "id": this.EditData.id,
      "user_id": this.EditData.user_id,
      "name": this.EditData.name,
      "author_name": this.EditData.author_name,
      "language": this.EditData.language,
      "category": this.EditData.category.join(","),
      "description": this.EditData.description,
      "imagepath": this.EditData.imagepath,
      "audiopath": this.EditData.audiopath,
      "status": this.EditData.approvals,
      "age_restriction": this.EditData.age_restriction ? 1 : 0,
      "created_by": this.LocalStorage.getUserData().username,
      "usertype": "Admin",
      "note_description": this.EditData.Notestocommunicate,
      "audio_path": this.EditData.audiopath

    }
    this.webservice.commonMethod('podcast/update', req, 'PUT').subscribe(
      (data) => {
        this.prodcastservice.loader=false;
        if(data.Status == 'Success' && data.Response && data.Response.length){
          this.toast.success('Updated Sucessfully');
          this.router.navigateByUrl('/dashboard');
        }
      }
    )
  }
backtodashboard(){
  this.prodcastservice.loader=false;
  // this.router.navigateByUrl('/dashboard');
  this.prodcastservice.IsView = false;
  this.EditData.category = this.EditData.category.join(",");
  this.back.emit()
  }
  removeAudio(){
    this.prodcastservice.loader=true;
    let req = {
      filename : this.EditData.audiopath
  }
    this.webservice.commonMethod("s3bucket/remove", this.EditData.audiopath, 'DELETE').
      subscribe((data: any) => {
        this.prodcastservice.loader=false;
        this.EditData.audiopath = '';
      },err=>{
        this.prodcastservice.loader=false;
        this.EditData.audiopath = '';//temp added due to api error
      });
  }
  removeFile(){
    this.prodcastservice.loader=true;
    let req = {
        filename : this.EditData.imagepath
    }
    this.webservice.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this.EditData.imagepath = '';
        this.prodcastservice.loader=false;
      },err=>{
        this.prodcastservice.loader=false;
        this.EditData.imagepath = '';
      });
  }
}
