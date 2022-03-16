import { Component, OnInit, Output } from '@angular/core';
import { ProdcastService } from 'src/app/shared/services/prodcast.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-approval-popup',
  templateUrl: './approval-popup.component.html',
  styleUrls: ['./approval-popup.component.scss']
})
export class ApprovalPopupComponent implements OnInit {
  notes: string = "";
  broadCastDate: string = "";
  broadCastTime: string = "";
  constructor(public prodcastService: ProdcastService, public webService: WebService, public toast: ToastService) { }

  ngOnInit() {
  }
  approveProdCast(status) {
    if (this.notes == '') {
      this.toast.error('Please add notes');
      return;
    }
    this.prodcastService.loader = true;
    let req =
    {
      "podcast_id": this.prodcastService.selectedData.id,
      "user_id": this.prodcastService.selectedData.user_id,
      "usertype": "Admin",
      "note_description": this.notes,
      "status": status,
      "created_by": this.prodcastService.loginUserName,
      "audio_path": this.prodcastService.selectedData.audiopath
    }
    this.webService.commonMethod('podcast/approvalstatus/admin', req, 'POST').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        this.prodcastService.showPopUp.approval = false;
        this.prodcastService.showPopUp.rejected = false;
        this.prodcastService.showPopUp.modify = false;
        if (data.Status == 'Success' && data.Response) {
          this.toast.success('Podcast '+status+' Sucessfully');
          this.prodcastService.getDashBoardList();
        } else
          this.toast.error('Internal Server error');
      }
    )
  }

  approveBroadcastCast() {
    this.prodcastService.loader = true;
    let req =
    {
      "podcast_id": this.prodcastService.selectedData.id,
      "created_by": this.prodcastService.loginUserName,
      "broadcast_date": this.broadCastDate + ' ' + this.broadCastTime
    }
    this.webService.commonMethod('podcast/broadcast/admin', req, 'PUT').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        this.prodcastService.showPopUp.broadcast = false;
        if (data.Status == 'Success' && data.Response) {
          this.toast.success('Broadcasted Sucessfully');
          this.prodcastService.getDashBoardList();
        }
        else
          this.toast.error('Internal Server error');
      }
    )
  }

  deletePodCast() {
    this.prodcastService.loader = true;
    let req =
    {
      "id": this.prodcastService.selectedData.id,
      "user_id": this.prodcastService.selectedData.user_id,
      "usertype": "Admin",
      "note_description": this.notes,
      "status": this.prodcastService.selectedData.approvals,
      "created_by": "Admin",
      "audio_path":this.prodcastService.selectedData.audiopath
    }
    this.webService.commonMethod('podcast/delete/admin', req, 'POST').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        this.prodcastService.showPopUp.delete = false;
        if (data.Status == 'Success' && data.Response) {
          this.toast.success('Deleted Sucessfully');
          this.prodcastService.getDashBoardList();
        }
        else
          this.toast.error('Internal Server error');
      }
    )
  }



}
