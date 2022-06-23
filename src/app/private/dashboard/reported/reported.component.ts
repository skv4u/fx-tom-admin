import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-reported',
  templateUrl: './reported.component.html',
  styleUrls: ['./reported.component.scss']
})
export class ReportedComponent implements OnInit {

  constructor(public ps: ProdcastService, public _toaster: ToastService, public _webService: WebService, public LocalStorage: LocalstorageService) { }

  reportedList: any[] = [];

  ngOnInit() {
    this.getReportedList();
  }

  getReportedList() {
    this.ps.loader = true;
    let req = {
      "user_id": this.LocalStorage.getUserData().id
    }
    this._webService.commonMethod('user/reported/list', req, 'POST').subscribe(
      (data) => {
        this.ps.loader = false;
        if (data.Status == 'Success' && data.Response.length) {
          this.reportedList = data.Response;
        }
        // this.getCommentList();
      }, err => {
        //if (err.status === 401) {
        this.ps.loader = false;
        this.ps.TokenExpied(err.status);
        // }
      }
    )
  }

  DeleteComment(id) {
    this.ps.loader = true;
    let req = {
      "comment_id": id,
      "user_id": this.LocalStorage.getUserData().id
    }
    this._webService.commonMethod('mobuser/comment', req, 'DELETE').subscribe(
      (data) => {
        this.ps.loader = false;
        if (data.Status == 'Success' && data.Response) {
          this._toaster.success("Deleted Successfully");
          this.getReportedList();
        }
        // this.getCommentList();
      }, err => {
        //if (err.status === 401) {
        this.ps.loader = false;
        this.ps.TokenExpied(err.status);
        // }
      }
    )
  }

}
