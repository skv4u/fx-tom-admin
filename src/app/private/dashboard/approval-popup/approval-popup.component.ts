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
  notes:string="";
  broadCastDate:string="";
  broadCastTime:string="";
  constructor(public prodcastService:ProdcastService,public webService:WebService,public toast:ToastService) { }

  ngOnInit() {
  }
  approveProdCast(){
    if(this.notes == ''){
      this.toast.error('Please add notes');
      return;
    }
    this.prodcastService.loader=true;
    let req=
    {
    "podcast_id": this.prodcastService.selectedData.id,
    "user_id":this.prodcastService.selectedData.user_id,
    "usertype":"Admin",
    "note_description":this.notes,
    "status":"Approved",
    "created_by": this.prodcastService.loginUserName,
    "audio_path": this.prodcastService.selectedData.audiopath
    }
    this.webService.commonMethod('podcast/approval/admin',req,'POST').subscribe(
      (data)=>{
        this.prodcastService.loader=false;
        if(data.Status == 'Success' && data.Response){
          this.toast.success('Podcast Approved Sucessfully');
          this.prodcastService.getDashBoardList();
          this.prodcastService.showPopUp.approval = false;
        }
      }
    )
  }

  approveBroadcastCast(){
    this.prodcastService.loader=true;
    let req=
    {
    "podcast_id": this.prodcastService.selectedData.id,
    "created_by":this.prodcastService.loginUserName,
    "broadcast_date":this.broadCastDate +' '+ this.broadCastTime
    }
    this.webService.commonMethod('podcast/broadcast/admin',req,'PUT').subscribe(
      (data)=>{
        this.prodcastService.loader=false;
        if(data.Status == 'Success' && data.Response){
          this.toast.success('Broadcasted Sucessfully');
          this.prodcastService.getDashBoardList();
          this.prodcastService.showPopUp.broadcast = false;
        }
      }
    )
  }
}
