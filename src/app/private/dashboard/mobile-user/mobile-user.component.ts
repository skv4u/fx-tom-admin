import { Component, OnInit } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-mobile-user',
  templateUrl: './mobile-user.component.html',
  styleUrls: ['./mobile-user.component.scss']
})
export class MobileUserComponent implements OnInit {

  selectionType: string = 'name';
  selectionValue: any = '';
  selectionList: any[] = ['name', 'mobile', 'email'];
  searchList: any[] = [];
  constructor(public _toaster: ToastService, public ps: ProdcastService, public _webService: WebService) { }

  ngOnInit() {
  }

  LoadDetails() {
    if (this.selectionValue.trim().length < 2) {
      this._toaster.error("Minimum 2 characters required");
      return
    }
    this.searchList = [];
    let req = {
      "type": this.selectionType,
      "keyword1": this.selectionValue,
      "keyword2": ""
    }
    this.ps.loader = true;
    this._webService.commonMethod('admin/mobuser/search', req, 'POST',
    ).subscribe(data => {
      if (data.Status == 'Success' && data.Response.length) {
        this.searchList = data.Response;
      } else {
        this._toaster.error("No records found...");
      }
      this.ps.loader = false;
    }, err => {
      this.ps.loader = false;
    })

  }
  selectionChangeValue(){
    this.selectionValue = '';
    this.searchList = [];
  }

  updateBlockorUnblock(active, mobuserid) {
    let req = {
      "is_active": active == '1' ? '0' : '1',
      "mobuser_id": mobuserid
    }
    this.ps.loader = true;
    this._webService.commonMethod('admin/mobuser/status_update', req, "PUT").subscribe(
      data => {
        if (data.Status == 'Success') {
          this._toaster.success('Status updated successfully');
          this.LoadDetails();
        } else {
          this._toaster.error('Something went wrong');
        }
        this.ps.loader = false;
      }, err => {
        this.ps.loader = false;
      })
  }
}
